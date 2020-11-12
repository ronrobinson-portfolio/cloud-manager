<?php

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id'     => 1,
                'status' => 'Online',
            ],
            [
                'id'     => 2,
                'status' => 'Offline',
            ],
        ];

        collect($data)->each(function($currData) {
            Status::forceCreate($currData);
        });
    }
}
