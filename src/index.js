import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

class PicPlayer {
	constructor(config) {
		const _config = {
			root: "picPlayer",
			images: [],
			width: window.innerWidth,
			height: window.innerHeight
		};
		this.config = {
			..._config,
			...config
		};
		this.width = this.config.width;
		this.height = this.config.height;
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
		const app = new PIXI.Application({
			width: this.config.width,
			height: this.config.height,
		});
		rootNode.appendChild(app.view);
		this.stage = app.stage;
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
			text.text = `加载中... ${progress}%`;
		});
		this.loader.add(this.config.images).load(() => {
			this.stage.removeChild(text);
			this.showImages();
		});
	}
	showImages() {
		console.log(this.loader.resources);
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
		gsap.from(image, {pixi: {y:-image.height}, duration:1.5,ease:"Bounce.easeOut"});
	}
}

export default PicPlayer;