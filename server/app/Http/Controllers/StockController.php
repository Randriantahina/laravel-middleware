<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use Illuminate\Support\Facades\Validator;

class StockController extends Controller
{
    public function index(){
        return Stock::all();
    }
    public function store(Request $request){
         $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|string',
        ]);

    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $stock = Stock::create([
            'name' => $request->name,
            'quantity' => $request->quantity,
            'status' => $request->status,
        ]);


           if ($stock->quantity < 100) {
        return response()->json([
            'stock' => $stock,
            'message' => 'Attention: la quantité est inférieure à 100. Pensez à ajouter plus de stock.'
        ], 201);
    }

        return response()->json($stock, 201);
    }
    public function update(Request $request, $id){
  
        $stock = Stock::find($id);
        if (!$stock) {
            return response()->json(['message' => 'Stock not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $stock->update($request->only('name', 'quantity', 'status'));
            if ($stock->quantity < 100) {
        return response()->json([
            'stock' => $stock,
            'message' => 'Attention: la quantité est inférieure à 100. Pensez à ajouter plus de stock.'
        ], 200);
    }

        return response()->json($stock, 200);
    }
     public function destroy($id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return response()->json(['message' => 'Stock not found'], 404);
        }
        $stock->delete();

        return response()->json(['message' => 'Stock deleted successfully'], 200);
    }

}