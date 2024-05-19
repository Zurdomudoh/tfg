<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    use HasFactory;

    protected $fillable = [
        'gift_id',
        'link',
        'price',
        'delivery',
        'source',
        'thumbnail'
    ];

    public function gift()
    {
        return $this->belongsTo(Gift::class);
    }
}
