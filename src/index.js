import { gsap } from "gsap";

// give the plugin a reference to the PIXI object
// PixiPlugin.registerPIXI(PIXI);

class PicPlayer {
	constructor(config) {
		const _config = {
			root: "picPlayer",
			images: []
		};
		this.config = {
			..._config,
			...config
		};
		this.loader = PIXI.Loader.shared;
		this.stage = null;

		//当前播放的索引
		this.playIndex = 0;

		this.init();
		this.loadImages();
	}
	init() {
		let rootNode = this.config.root;
		if (typeof rootNode == "string") {
			rootNode = document.querySelector(`#${rootNode}`);
		}
		if (!rootNode) {
			throw new Error("need to given a HTML element or id");
		}
		this.width = rootNode.offsetWidth;
		this.height = rootNode.offsetHeight;
		
		const app = new PIXI.Application({
			width: this.width,
			height: this.height,
		});
		rootNode.appendChild(app.view);
		app.resizeTo = rootNode;
		this.stage = app.stage;

		window.addEventListener("resize",()=>{
			app.resize();
			this.width = rootNode.innerWidth;
			this.height = rootNode.innerHeight;
		})
	}
	loadImages() {
		const text = new PIXI.Text(`加载中... 0%`, {
			fill: "0xfff"
		});
		text.x = this.width / 2 - 100;
		text.y = this.height / 2 - 100;
		this.stage.addChild(text);
		this.loader.onProgress.add(({
			progress
		}) => {
			text.text = `加载中... ${progress | 0}%`;
		});
		this.loader.add(this.config.images).load(() => {
			this.stage.removeChild(text);
			this.initEvents();
			this.showNextImage();
		});
	}
	initEvents(){
		this.stage.interactive = true;
		this.stage.on("click",()=>{
			if(this.config.images[this.playIndex]){
				this.showNextImage();
			}else{
				console.log("end")
			}
			
		})
	}
	showNextImage() {
		// console.log(this.loader.resources);
		
		const image = new PIXI.Sprite(this.loader.resources[this.config.images[this.playIndex]].texture);
		if (this.width > this.height) {
			image.height = this.height;
			image.scale.x = image.scale.y;
			image.x = this.width/2 - image.width/2;
		}else{
			image.width = this.width;
			image.scale.y = image.scale.x;
			image.y = this.height/2 - image.height/2;
		}
		this.stage.addChild(image);
		gsap.from(image, {y:-image.height,duration:1.5,ease:"Bounce.easeOut"});
		this.playIndex++;
	}
}

export default PicPlayer;