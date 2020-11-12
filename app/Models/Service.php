<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected static function booted()
    {
        static::addGlobalScope('name', function (Builder $builder) {
            $builder->orderBy('name');
        });
    }
}
