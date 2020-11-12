/**
 * Checks if the values are either null or undefined.
 */
var isNullOrUndefined = function () {
    var values = [], len = arguments.length;
    while ( len-- ) values[ len ] = arguments[ len ];

    return values.every(function (value) {
        return value === null || value === undefined;
    });
};

var parseSelector = function (selector) {
    var rule = null;
    if (includes(selector, ':')) {
        rule = selector.split(':').pop();
        selector = selector.replace((":" + rule), '');
    }

    if (selector[0] === '#') {
        return {
            id: selector.slice(1),
            rule: rule,
            name: null,
            scope: null
        };
    }

    var scope = null;
    var name = selector;
    if (includes(selector, '.')) {
        var parts = selector.split('.');
        scope = parts[0];
        name = parts.slice(1).join('.');
    }

    return {
        id: null,
        scope: scope,
        name: name,
        rule: rule
    };
};

var includes = function (collection, item) {
    return collection.indexOf(item) !== -1;
};

///////////////////////////////////////////////////////////////////////////
const ErrorBag = function ErrorBag (errorBag, id) {
    if ( errorBag === void 0 ) errorBag = null;
    if ( id === void 0 ) id = null;

    this.vmId = id || null;
    // make this bag a mirror of the provided one, sharing the same items reference.
    if (errorBag && errorBag instanceof ErrorBag) {
        this.items = errorBag.items;
    } else {
        this.items = [];
    }
};

ErrorBag.prototype[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] = function () {
    var this$1 = this;

    var index = 0;
    return {
        next: function () {
            return { value: this$1.items[index++], done: index > this$1.items.length };
        }
    };
};

/**
 * Adds an error to the internal array.
 */
ErrorBag.prototype.add = function add (error) {
    var ref;

    (ref = this.items).push.apply(
        ref, this._normalizeError(error)
    );
};

/**
 * Normalizes passed errors to an error array.
 */
ErrorBag.prototype._normalizeError = function _normalizeError (error) {
    var this$1 = this;

    if (Array.isArray(error)) {
        return error.map(function (e) {
            e.scope = !isNullOrUndefined(e.scope) ? e.scope : null;
            e.vmId = !isNullOrUndefined(e.vmId) ? e.vmId : (this$1.vmId || null);

            return e;
        });
    }

    error.scope = !isNullOrUndefined(error.scope) ? error.scope : null;
    error.vmId = !isNullOrUndefined(error.vmId) ? error.vmId : (this.vmId || null);

    return [error];
};

/**
 * Regenrates error messages if they have a generator function.
 */
ErrorBag.prototype.regenerate = function regenerate () {
    this.items.forEach(function (i) {
        i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg;
    });
};

/**
 * Updates a field error with the new field scope.
 */
ErrorBag.prototype.update = function update (id, error) {
    var item = find(this.items, function (i) { return i.id === id; });
    if (!item) {
        return;
    }

    var idx = this.items.indexOf(item);
    this.items.splice(idx, 1);
    item.scope = error.scope;
    this.items.push(item);
};

/**
 * Gets all error messages from the internal array.
 */
ErrorBag.prototype.all = function all (scope) {
    var this$1 = this;

    var filterFn = function (item) {
        var matchesScope = true;
        var matchesVM = true;
        if (!isNullOrUndefined(scope)) {
            matchesScope = item.scope === scope;
        }

        if (!isNullOrUndefined(this$1.vmId)) {
            matchesVM = item.vmId === this$1.vmId;
        }

        return matchesVM && matchesScope;
    };

    return this.items.filter(filterFn).map(function (e) { return e.msg; });
};

/**
 * Checks if there are any errors in the internal array.
 */
ErrorBag.prototype.any = function any (scope) {
    var this$1 = this;

    var filterFn = function (item) {
        var matchesScope = true;
        var matchesVM = true;
        if (!isNullOrUndefined(scope)) {
            matchesScope = item.scope === scope;
        }

        if (!isNullOrUndefined(this$1.vmId)) {
            matchesVM = item.vmId === this$1.vmId;
        }

        return matchesVM && matchesScope;
    };

    return !!this.items.filter(filterFn).length;
};

/**
 * Removes all items from the internal array.
 */
ErrorBag.prototype.clear = function clear (scope) {
    var this$1 = this;

    var matchesVM = isNullOrUndefined(this.vmId) ? function () { return true; } : function (i) { return i.vmId === this$1.vmId; };
    var matchesScope = function (i) { return i.scope === scope; };
    if (arguments.length === 0) {
        matchesScope = function () { return true; };
    } else if (isNullOrUndefined(scope)) {
        scope = null;
    }

    for (var i = 0; i < this.items.length; ++i) {
        if (matchesVM(this.items[i]) && matchesScope(this.items[i])) {
            this.items.splice(i, 1);
            --i;
        }
    }
};

/**
 * Collects errors into groups or for a specific field.
 */
ErrorBag.prototype.collect = function collect (field, scope, map) {
    var this$1 = this;
    if ( map === void 0 ) map = true;

    var isSingleField = !isNullOrUndefined(field) && !field.includes('*');
    var groupErrors = function (items) {
        var errors = items.reduce(function (collection, error) {
            if (!isNullOrUndefined(this$1.vmId) && error.vmId !== this$1.vmId) {
                return collection;
            }

            if (!collection[error.field]) {
                collection[error.field] = [];
            }

            collection[error.field].push(map ? error.msg : error);

            return collection;
        }, {});

        // reduce the collection to be a single array.
        if (isSingleField) {
            return values(errors)[0] || [];
        }

        return errors;
    };

    if (isNullOrUndefined(field)) {
        return groupErrors(this.items);
    }

    var selector = isNullOrUndefined(scope) ? String(field) : (scope + "." + field);
    var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;

    var collected = this.items.reduce(function (prev, curr) {
        if (isPrimary(curr)) {
            prev.primary.push(curr);
        }

        if (isAlt(curr)) {
            prev.alt.push(curr);
        }

        return prev;
    }, { primary: [], alt: [] });

    collected = collected.primary.length ? collected.primary : collected.alt;

    return groupErrors(collected);
};

/**
 * Gets the internal array length.
 */
ErrorBag.prototype.count = function count () {
    var this$1 = this;

    if (this.vmId) {
        return this.items.filter(function (e) { return e.vmId === this$1.vmId; }).length;
    }

    return this.items.length;
};

/**
 * Finds and fetches the first error message for the specified field id.
 */
ErrorBag.prototype.firstById = function firstById (id) {
    var error = find(this.items, function (i) { return i.id === id; });

    return error ? error.msg : undefined;
};

/**
 * Gets the first error message for a specific field.
 */
ErrorBag.prototype.first = function first (field, scope) {
    if ( scope === void 0 ) scope = null;

    var selector = isNullOrUndefined(scope) ? field : (scope + "." + field);
    var match = this._match(selector);

    return match && match.msg;
};

/**
 * Returns the first error rule for the specified field
 */
ErrorBag.prototype.firstRule = function firstRule (field, scope) {
    var errors = this.collect(field, scope, false);

    return (errors.length && errors[0].rule) || undefined;
};

/**
 * Checks if the internal array has at least one error for the specified field.
 */
ErrorBag.prototype.has = function has (field, scope) {
    if ( scope === void 0 ) scope = null;

    return !!this.first(field, scope);
};

/**
 * Gets the first error message for a specific field and a rule.
 */
ErrorBag.prototype.firstByRule = function firstByRule (name, rule, scope) {
    if ( scope === void 0 ) scope = null;

    var error = this.collect(name, scope, false).filter(function (e) { return e.rule === rule; })[0];

    return (error && error.msg) || undefined;
};

/**
 * Gets the first error message for a specific field that not match the rule.
 */
ErrorBag.prototype.firstNot = function firstNot (name, rule, scope) {
    if ( rule === void 0 ) rule = 'required';
    if ( scope === void 0 ) scope = null;

    var error = this.collect(name, scope, false).filter(function (e) { return e.rule !== rule; })[0];

    return (error && error.msg) || undefined;
};

/**
 * Removes errors by matching against the id or ids.
 */
ErrorBag.prototype.removeById = function removeById (id) {
    var condition = function (item) { return item.id === id; };
    if (Array.isArray(id)) {
        condition = function (item) { return id.indexOf(item.id) !== -1; };
    }

    for (var i = 0; i < this.items.length; ++i) {
        if (condition(this.items[i])) {
            this.items.splice(i, 1);
            --i;
        }
    }
};

/**
 * Removes all error messages associated with a specific field.
 */
ErrorBag.prototype.remove = function remove (field, scope, vmId) {
    if (isNullOrUndefined(field)) {
        return;
    }

    var selector = isNullOrUndefined(scope) ? String(field) : (scope + "." + field);
    var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;
    var matches = function (item) { return isPrimary(item) || isAlt(item); };
    var shouldRemove = function (item) {
        if (isNullOrUndefined(vmId)) { return matches(item); }

        return matches(item) && item.vmId === vmId;
    };

    for (var i = 0; i < this.items.length; ++i) {
        if (shouldRemove(this.items[i])) {
            this.items.splice(i, 1);
            --i;
        }
    }
};

ErrorBag.prototype._makeCandidateFilters = function _makeCandidateFilters (selector) {
    var this$1 = this;

    var matchesRule = function () { return true; };
    var matchesScope = function () { return true; };
    var matchesName = function () { return true; };
    var matchesVM = function () { return true; };

    var ref = parseSelector(selector);
    var id = ref.id;
    var rule = ref.rule;
    var scope = ref.scope;
    var name = ref.name;

    if (rule) {
        matchesRule = function (item) { return item.rule === rule; };
    }

    // match by id, can be combined with rule selection.
    if (id) {
        return {
            isPrimary: function (item) { return matchesRule(item) && (function (item) { return id === item.id; }); },
            isAlt: function () { return false; }
        };
    }

    if (isNullOrUndefined(scope)) {
        // if no scope specified, make sure the found error has no scope.
        matchesScope = function (item) { return isNullOrUndefined(item.scope); };
    } else {
        matchesScope = function (item) { return item.scope === scope; };
    }

    if (!isNullOrUndefined(name) && name !== '*') {
        matchesName = function (item) { return item.field === name; };
    }

    if (!isNullOrUndefined(this.vmId)) {
        matchesVM = function (item) { return item.vmId === this$1.vmId; };
    }

    // matches the first candidate.
    var isPrimary = function (item) {
        return matchesVM(item) && matchesName(item) && matchesRule(item) && matchesScope(item);
    };

    // matches a second candidate, which is a field with a name containing the '.' character.
    var isAlt = function (item) {
        return matchesVM(item) && matchesRule(item) && item.field === (scope + "." + name);
    };

    return {
        isPrimary: isPrimary,
        isAlt: isAlt
    };
};

ErrorBag.prototype._match = function _match (selector) {
    if (isNullOrUndefined(selector)) {
        return undefined;
    }

    var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;

    return this.items.reduce(function (prev, item, idx, arr) {
        var isLast = idx === arr.length - 1;
        if (prev.primary) {
            return isLast ? prev.primary : prev;
        }

        if (isPrimary(item)) {
            prev.primary = item;
        }

        if (isAlt(item)) {
            prev.alt = item;
        }

        // keep going.
        if (!isLast) {
            return prev;
        }

        return prev.primary || prev.alt;
    }, {});
};

export default ErrorBag;
