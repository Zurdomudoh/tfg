<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gift extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description','status'];

    public function giftUsers()
    {
        return $this->hasMany(GiftUser::class);
    }


    public function detail()
    {
        return $this->hasOne(Detail::class);
    }
}
