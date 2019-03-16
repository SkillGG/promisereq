let PromiseReq = {};

//PromiseReq.getServerFile() & .sendToServer()

/*
conf: {
	type:"GET",
	path:""
}
*/
PromiseReq.getServerFile = conf=>{
	return new Promise((res,rej)=>{
		let xhr = new XMLHttpRequest();
		xhr.open(conf.type || "GET", conf.path);
		xhr.onreadystatechange = $=>{
			const {status, statusText, readyState, responseText} = xhr;
			if(readyState === 4 && status === 200)
				res(responseText);
			else if(readyState === 4 && status !== 200){
				
				rej(`There was a problem with getting file! ${status}(${statusText}) :: ${readyState}!`);
			}
		};xhr.send();
	});
}

PromiseReq.getFile = async function(path){
	return {data:await PromiseReq.getServerFile({path})};
};

/**
config:
{
	type:"POST",
	path:"",
	arrayJoin:""
}

@return Promise with complecity status
*/
PromiseReq.sendToServer = (config, data)=>{
	return new Promise((res, rej)=>{
		try{
			let xhr = new XMLHttpRequest();
			xhr.open(config.type || "POST", config.path);
			if(/object/gi.test(typeof data)){
				if(data instanceof Array){
					data = data.join(config.arrayJoin || "");
				}
				if(data instanceof Object){
					data = JSON.stringify(data);
				}
			}
			else{
				if(/string/gi.test(typeof data)){
					if(/get/gi.test(config.type)){
						data = encodeURIComponent(data);
					}
				}
				if(/function/gi.test(typeof data)){
					rej("Data should not be a function!");
				}
				else{
					data = String(data);
				}
			}xhr.send(data);
			res('Everything went smoothly!' + `
				Data sent: [${data}] to ${config.path} via ${config.type}`);
		}catch(e){
			rej(e);
		}
	});

}

/*

sendToServer Example:

PromiseReq.sendToServer(
	{
		type:'POST',
		path:'../save.php'
	},
	{
		path:"films.tbm",
		opentype:"a",
		data:"\n\rv0[Film Name[2018]](-,-,-)"
	})
	.then(c=>console.log(c))
	.catch(e=>console.error(e));

getServerFile Example:

PromiseReq.getServerFile({
	type:'GET',
	path:'../films.tbm'
	})
	.then(c=> console.log(c)) // Do parsing of the file!
	.catch(e=>console.error(e));

OR:

let ret = await PromiseReq.getServerFile({
	type:'GET',
	path:'../films.tbm'
	});

OR:

let value;
let getFilms = async function(){
	let ret = await PromiseReq.getServerFile({
		type:"GET",
		path:"../films.tbm"
	});
	value = ret;
};
getFilms()
.then($=>{
	//STUFF WITH FULLFILLED value
})
.catch(e=>conosle.error(e));

*/