let PromiseReq = {};

//PromiseReq.getServerFile() & .sendToServer()

/*
conf: {
	type:"GET",
	path:"",
	nocache:false,
	customHeaders:[]
}
*/
PromiseReq.getServerFile = conf=>{
	return new Promise((res,rej)=>{
		let xhr = new XMLHttpRequest();
		xhr.open(conf.type || "GET", conf.path);
		if(conf.nocache){
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("Pragma", "no-cache");
		}
		if(Array.isArray(conf.customHeaders)){
			conf.customHeaders.forEach(e=>{
				xhr.setRequestHeader(e.name || "", e.value || "");
			});
		}
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

PromiseReq.getFile = async function(path, nocache, customHeaders){
	return {data:await PromiseReq.getServerFile({path, nocache, customHeaders})};
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
				else if(/function/gi.test(typeof data)){
					rej("Data should not be a function!");
				}
				else{
					data = String(data);
				}
			}
			xhr.onreadystatechange = ()=>{
				if(xhr.readyState === 4){
					if(xhr.status === 200){
						res({response:xhr.responseText,
						info: `Everything went smoothly!
Data sent: [${data}] to ${config.path} via ${config.type}`});
					}
					else
						throw "Something went wrong!";
				}
			}
			xhr.send(data);
			
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
