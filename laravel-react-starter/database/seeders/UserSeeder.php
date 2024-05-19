<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Isaac', 'email' => 'isaac@email.com','role' => 'admin', 'password' => Hash::make('qweasdzxc')],
            ['name' => 'Agustin', 'email' => 'agustin@email.com','role' => 'admin','password' => Hash::make('qweasdzxc')],
            ['name' => 'Macarena', 'email' => 'macarena@email.com','role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'David', 'email' => 'david@email.com','role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'Laura', 'email' => 'laura@email.com','role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'Pedro', 'email' => 'pedro@email.com','role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'Sofia', 'email' => 'sofia@email.com', 'role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'Carlos', 'email' => 'carlos@email.com','role' => 'user','password' => Hash::make('qweasdzxc')],
            ['name' => 'UsuarioLibre', 'email' => 'usuarioLibre@email.com','role' => 'user', 'password' => Hash::make('qweasdzxc')],
        ];
        
        DB::table('users')->insert($users);
    }
}
