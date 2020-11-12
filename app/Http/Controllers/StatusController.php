<?php

namespace App\Http\Controllers;

use App\Models\Status;
use App\Http\Resources\StatusResource;

class StatusController extends Controller
{
    function list()
    {
        return StatusResource::collection(Status::all());
    }
}
