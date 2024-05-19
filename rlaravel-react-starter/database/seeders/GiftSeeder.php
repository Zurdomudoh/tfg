<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gifts = [
            ['name' => 'Seventeen', 'description' => 'Album Kpop', 'status' => '0'],
            ['name' => 'Quemador Incienso', 'description' => 'Quemador de incienso de arena', 'status' => '0'],
            ['name' => 'Funda reloj', 'description' => 'funda para smartwatch', 'status' => '0'],
            ['name' => 'Juego PS5', 'description' => 'Resident Evil 9', 'status' => '0'],
            ['name' => 'Linterna', 'description' => 'Linterna patinete', 'status' => '0'],
            ['name' => 'P1Harmony', 'description' => 'Album Kpop', 'status' => '0'],

        ];
        DB::table('gifts')->insert($gifts);
    }
}
