<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Resources\ServiceResource;

class ServiceController extends Controller
{
    function list()
    {
        return ServiceResource::collection(Service::all());
    }
}
