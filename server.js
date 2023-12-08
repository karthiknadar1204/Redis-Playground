const express=require('express');
const axios=require('axios');
const client=require('./client');

const app=express();


app.get('/',async(req,res)=>{
    //First check if the data was cached into the redis server
    const cachedValue=await client.get('todos');

    if(cachedValue){
        return res.json(JSON.parse(cachedValue));
    }

    const {data}=await axios.get('https://jsonplaceholder.typicode.com/todos');

    //cache the data in REDIS server
    await client.set('todos',JSON.stringify(data));
    await client.expire('todos',30);
    return res.json(data);
})

app.listen(9001);
