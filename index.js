

	var map = map4;
	const scene = document.getElementById("scene");  
	const sceneContext = scene.getContext("2d");  
	const cellSize = 20;
	const screenW = cellSize * map[0].length;  
	const screenH = cellSize * map.length;
	
	const fov = 60;
	var img = new Image();
	img.src = "spooky.png";
	
	
	var Times = [];
	var Time = 0;
	var left = 0;
	var right = 0;
	var up = 0;
	var down = 0;
	var pallette = ["",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
					""];
					
	var Stop = false;
	
	const camera = {    
	  x: parseInt(1) * cellSize + cellSize / 2,
	  y: 48 * cellSize + cellSize / 2,    
	  rotation: 0,    
	  angle: toRadian(90),    
	  update: function() {      
		this.rotation *= 0.5;      
		this.angle += this.rotation;    
	  }  
	};  
	
	function LoadMap(m){
		camera.x = parseInt(2) * cellSize + cellSize / 2;
		camera.y = 2 * cellSize + cellSize / 2;
		map = m;
	};
	
	
	function AssignRandomHex(item,index){
		var r = ('0'+(Math.random()*150|0).toString(16)).slice(-2);
        var g = ('0'+(Math.random()*150|0).toString(16)).slice(-2);
        var b = ('0'+(Math.random()*150|0).toString(16)).slice(-2);
		pallette[index] = '#' +r+g+b;
	}
	
	function ChangePallette(){
		pallette.forEach(AssignRandomHex);
	}
	
	ChangePallette();
	function GetColor(id){
		switch(id){
			case 1:
				return pallette[0];
			case 2:
				return pallette[1];
			case 3:
				return pallette[2];
			case 4:
				return pallette[3];
			case 5:
				return pallette[4];
			case 6:
				return pallette[5];
			case 7:
				return pallette[6];
			case 8:
				return pallette[7];
			case 9:
				return pallette[8];

			default:
				return "#FFFFFF";
		}
	}

	  
	const sceneData = [];
	  
	scene.width = 820;  scene.height = 460;   
	scene.style.background = "#111111";  
	scene.style.border = "solid 2px white";
	

	
	const castRay = function(srcX, srcY, angle) {    
	  let rayX = srcX + Math.cos(angle);    
	  let rayY = srcY + Math.sin(angle);    
	  let dst = 0;   
	  let isHit = false;     
	  while (!isHit && dst < scene.width) {      
		dst += 0.1;      
		rayX = srcX + Math.cos(angle) * dst;      
		rayY = srcY + Math.sin(angle) * dst;       
		const row = parseInt(rayY / cellSize);      
		const col = parseInt(rayX / cellSize);       
		const a = camera.angle - angle;      
		const z = dst * Math.cos(a);      
		const h = scene.height / 2 * 64 / z;

		if (rayX > screenW  - 4 || rayX < 4 || rayY < 4 || rayY >   screenH - 4) {        
		  isHit = true;        
		  sceneData.push({ h, val: -1});      
		} else      
		if (map[row][col] > 0 &&  map[row][col] <     10) {        
		  isHit = true;        
		  sceneData.push({ h, val: map[row][col] });      
		}    
	  }    
	};
	
	
	const castRays = function() { 
	  rect(sceneContext,0,0,scene.width,scene.height,"darkslategray", "fill",true);
	  rect(sceneContext,0,scene.height,scene.width,scene.height,"brown", "fill",true);
	  sceneData.length = 0;     
	  for (let x = -fov / 2; x < fov / 2; x += 0.5) {      
		const rayAngle = camera.angle + toRadian(x);      
		castRay(camera.x, camera.y, rayAngle);    
	  }     
	  const w = parseInt(scene.width / sceneData.length);     
	  for (let i = 0; i < sceneData.length; i ++) {      
		const h = sceneData[i].h;      
		const alpha = h / 200;      
		//sceneContext.globalAlpha = alpha;      
		const x = i + (i * w);      
		const y = scene.height / 2;      
		rect(sceneContext, x, y, w+1,  h, GetColor(sceneData[i].val),   "fill", true);     
		
		sceneContext.globalAlpha = 1;    
	  }  
	};
	
	const update = function() { camera.update(); castRays(); };
	
		
	const draw = function() {    
	  sceneContext.clearRect(0, 0, scene.width, scene.height);       
	};
	
	function MoveCharacter(){
		camera.rotation += 0.05*(right-left);
		nx = camera.x + Math.cos(camera.angle) *(up-down);
		ny = camera.y + Math.sin(camera.angle) *(up-down);
		if ( (0 <= ((ny/cellSize) | 0) <= map[0].length-2) && (0 <= ((nx/cellSize) | 0) <= map.length-2) ){
			if (map[(ny/cellSize) | 0][(nx/cellSize) | 0] == 0){
				camera.x = nx;
				camera.y = ny;
			}else{
				if (map[(ny/cellSize) | 0][(nx/cellSize) | 0] == 10){
					ChangePallette();
					Times.push((Time | 0).toString());
					Time = 0;
					Stop=true;
				}
			}
		}
	}
	
	function InterLevel(LevelName,nextMap){
		sceneContext.clearRect(0, 0, screen.width, screen.height);
		sceneContext.font = "48px Arial";
		sceneContext.fillStyle = "white";
	    sceneContext.fillText(LevelName, 300, 200);
		setTimeout(() => {  Stop = false; LoadMap(nextMap); frame(); }, 2000);	
	}
	
	function Dead(){
		sceneContext.clearRect(0, 0, screen.width, screen.height);
		sceneContext.font = "48px Arial";
		sceneContext.fillStyle = "white";
		sceneContext.drawImage(img,250,300);
	    sceneContext.fillText("Trop Tard", 250, 200);
		setTimeout(() => {  Stop = false; LoadMap(map); frame(); Time=0; }, 2000);	
	}
	
	function Start_Screen(){
		sceneContext.clearRect(0, 0, screen.width, screen.height);
		sceneContext.font = "48px Arial";
		sceneContext.fillStyle = "white";
	    sceneContext.fillText("The Basement", 250, 100);
		sceneContext.font = "30px Arial";
		sceneContext.fillText("Trouver la sortie le plus vite possible dans ces 4 niveaux.", 30, 170);
		sceneContext.fillText("Dépechez...", 300, 220);
		setTimeout(() => { 	document.body.addEventListener('keydown',OnKeyPress); document.body.addEventListener('keyup',OnKeyRelease);InterLevel("L'entrepot", map1); }, 2000);	
	}
	
	function End_Screen(){
		sceneContext.clearRect(0, 0, screen.width, screen.height);
		sceneContext.font = "48px Arial";
		sceneContext.fillStyle = "white";
	    sceneContext.fillText("Bravo !", 350, 100);
		sceneContext.font = "30px Arial";
		sceneContext.fillText("Niveau 1 : "+Times[0]+ " s", 290, 150);
		sceneContext.fillText("Niveau 2 : "+Times[1]+ " s", 290, 190);
		sceneContext.fillText("Niveau 3 : "+Times[2]+ " s", 290, 230);
		sceneContext.fillText("Niveau 4 : "+Times[3]+ " s", 290, 270);
		document.getElementById("buttonStart").hidden = false;
	}
	
	const frame = function() {  
	  Time+=0.01;
	  if ((Time | 0) > 200){
		Stop = true;
	  }
	  MoveCharacter();
	  draw();    
	  update();  		  
	  sceneContext.font = "20px Arial"
	  sceneContext.fillStyle = "black";
	  sceneContext.fillText("Temps : " +(Time | 0).toString(), 10, 25)
	  if(!Stop){
		requestAnimationFrame(frame); 
	  }else{
		if ((Time | 0) > 200){
			Dead();
		}else{
		if (map==map1){
			InterLevel("Une ombre",map2);
		}else{
		if (map==map2){
			InterLevel("Abysse",map3);
		}else{
		if (map==map3){
			InterLevel("Il regarde",map4);
		}else{
			End_Screen();	
	  }}}}}
	};

	
	function OnKeyPress (e){
	  if (e.keyCode === 37)  {left = 1}
	  if (e.keyCode === 39){right = 1}     
	  if (e.keyCode === 38){up=1}
	  if (e.keyCode === 40)  {down=1}
	}; 
	
	function OnKeyRelease (e){
	  if (e.keyCode === 37)  {left = 0}
	  if (e.keyCode === 39){right = 0}     
	  if (e.keyCode === 38){up=0}
	  if (e.keyCode === 40)  {down=0}
	}; 	
	
	//Start_Screen()
	

