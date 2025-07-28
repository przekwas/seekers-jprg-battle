import Phaser from 'phaser';

export default class BattleScene extends Phaser.Scene {
	private player!: Phaser.GameObjects.Sprite;
	private playerHpText!: Phaser.GameObjects.Text;
	private enemyHpText!: Phaser.GameObjects.Text;
	private enemy!: Phaser.GameObjects.Sprite;
	private battleLog!: Phaser.GameObjects.Text;
	private logMessages: string[] = [];
	private currentTurn: 'player' | 'enemy' = 'player';

	constructor() {
		super('BattleScene');
	}

	private playerStats = {
		hp: 100,
		maxHp: 100,
		attack: 20
	};

	private enemyStats = {
		hp: 80,
		maxHp: 80,
		attack: 15
	};

	private log(message: string) {
		this.logMessages.push(message);
		if (this.logMessages.length > 6) this.logMessages.shift();
		this.battleLog.setText(this.logMessages);
	}

	preload() {
		this.load.image('player', 'src/assets/characters/player.png');
		this.load.image('enemy', 'src/assets/characters/enemy.png');
	}

	create() {
		this.player = this.add.sprite(200, 300, 'player').setScale(2);

		this.enemy = this.add.sprite(600, 300, 'enemy').setScale(2);
		this.enemy.setFlipX(true);

		this.battleLog = this.add.text(20, 400, '', { fontSize: '16px', color: '#fff' });

		this.add.text(250, 50, 'Click to attack!', { fontSize: '24px', color: '#fff' });
		this.add.text(150, 200, 'Player HP:', { color: '#fff' });
		this.add.text(550, 200, 'Enemy HP:', { color: '#fff' });

		this.playerHpText = this.add.text(150, 225, `${this.playerStats.hp}`, { color: '#fff' });
		this.enemyHpText = this.add.text(550, 225, `${this.enemyStats.hp}`, { color: '#fff' });

		this.input.on('pointerdown', this.handleTurn, this);
	}

	handleTurn() {
		if (this.currentTurn !== 'player') return;

		this.tweens.add({
			targets: this.player,
			x: 300,
			duration: 100,
			yoyo: true,
			onComplete: () => {
				console.log('Player attacks!');
				this.log('Player used Slash!');
				this.enemyStats.hp -= this.playerStats.attack;
				this.enemyHpText.setText(`${this.enemyStats.hp}`);
				this.time.delayedCall(500, () => {});

				if (this.enemyStats.hp <= 0) {
					this.add.text(300, 500, 'You win!', { fontSize: '32px', color: '#00ff00' });
					this.input.removeAllListeners();
					return;
				}

				this.currentTurn = 'enemy';
				this.time.delayedCall(1000, () => this.enemyTurn());
			}
		});
	}

	enemyTurn() {
		this.tweens.add({
			targets: this.enemy,
			x: 500,
			duration: 100,
			yoyo: true,
			onComplete: () => {
				console.log('Enemy attacks!');
				this.log('Enemy used Bite!');
				this.playerStats.hp -= this.enemyStats.attack;
				this.playerHpText.setText(`${this.playerStats.hp}`);
				this.time.delayedCall(500, () => {
					if (this.enemyStats.hp <= 0) {
						this.add.text(300, 500, 'You lose!', { fontSize: '32px', color: '#ff0000' });
						this.input.removeAllListeners();
						return;
					}

					this.currentTurn = 'player';
				});
			}
		});
	}
}
