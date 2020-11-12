<?php

namespace App\Http\Controllers;

use App\Models\OperatingSystem;
use App\Http\Resources\OperatingSystemResource;

class OperatingSystemController extends Controller
{
    function list()
    {
        return OperatingSystemResource::collection(OperatingSystem::all());
    }
}
