<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'key',
        'ip',
        'status_id',
    ];

    protected static function booted()
    {
        static::addGlobalScope('name', function (Builder $builder) {
            $builder->orderBy('name');
        });
    }

    public function deviceable()
    {
        return $this->morphTo();
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
