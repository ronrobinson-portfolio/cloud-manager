<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AwsService extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service_id',
    ];

    public function device()
    {
        return $this->morphOne(Device::class, 'deviceable');
    }

    public function service() {
        return $this->belongsTo(Service::class);
    }
}
