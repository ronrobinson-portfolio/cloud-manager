<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Desktop extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'os_id'
    ];

    public function device()
    {
        return $this->morphOne(Device::class, 'deviceable');
    }

    public function os() {
        return $this->belongsTo(OperatingSystem::class);
    }
}
