import { Router } from "express";
import productos from "../productos.json" assert {type : "json"}
import fs from "fs"

const router = Router()


router.get("/",(req,res)=>{
    const {limit} = req.query
    if(limit){
        let productosLimite = []
        for(let i = 0; i < limit; i++){
            productosLimite.push(productos[i])
        }
        res.json({title: "Productos seleccionados", productos: productosLimite})
    }else{
        res.json({title: "Todos los productos" , productos : productos})
    }
})

router.get("/:pid",(req,res)=>{
    const {pid} = req.params
    let producto = productos.find((producto)=>producto.id === +pid)
    producto ? res.json({message : "Producto seleccionado", data : producto}) : res.status(404).json({message: "Producto no encontrado"})
})

router.put("/:pid",(req,res)=>{
    const {pid} = req.params
    let producto = productos.find((producto)=>producto.id === +pid)
    if(producto){
        const {title,description,code,price,stock,category,thumbnail} = req.body
        if(!title || !description || !code || !price || !stock || !category){
            return res.status(500).json({message : "Faltan datos"})
        }else{
            producto.title = title
            producto.description = description
            producto.code = code
            producto.price = price
            producto.stock = stock
            producto.category = category
            producto.thumbnail = thumbnail
            fs.writeFileSync("productos.json",JSON.stringify(productos))
            return res.json({message : "Producto modificado correctamente", data : producto})
        }
    }else{
        return res.status(404).json({message: "Producto no encontrado"})
    }
})

router.delete("/:pid",(req,res)=>{
    const {pid} = req.params
    let producto = productos.find((producto)=>producto.id === +pid)
    if(producto){
        let indexProducto = productos.indexOf(producto)
        productos.splice(indexProducto,1)
        fs.writeFileSync("productos.json",JSON.stringify(productos))
        return res.json({message : "Producto eliminado", data : productos})
    }else{
        return res.status(404).json({message : "Producto no encontrado"})
    }
})


export default router