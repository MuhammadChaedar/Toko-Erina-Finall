<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response([
        "status" => 200,
        "message" => "This is Home Page!"
    ], 200);
});
