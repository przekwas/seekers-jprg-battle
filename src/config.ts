import Phaser from 'phaser';
import BattleScene from './scenes/BattleScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#1d1d1d',
	scene: [BattleScene],
	parent: 'game'
};

export default config;
