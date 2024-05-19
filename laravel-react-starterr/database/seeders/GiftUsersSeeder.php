<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GiftUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $giftUsers = [
            ['user_id' => '1', 'gift_id' => '1'],
            ['user_id' => '1', 'gift_id' => '2'],
            ['user_id' => '2', 'gift_id' => '3'],
            ['user_id' => '1', 'gift_id' => '4'],
            ['user_id' => '2', 'gift_id' => '5'],
            ['user_id' => '3', 'gift_id' => '6'],


        ];
        DB::table('gift_users')->insert($giftUsers);
    }
}
