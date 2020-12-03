<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    public function devices()
    {
        return $this->hasMany(Device::class);
    }
}
