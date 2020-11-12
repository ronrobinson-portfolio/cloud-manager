<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OperatingSystem extends Model
{
    use SoftDeletes;

    protected static function booted()
    {
        static::addGlobalScope('os', function (Builder $builder) {
            $builder->orderBy('os');
        });
    }
}
