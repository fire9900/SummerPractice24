class Resources {
  constructor() {
    // Все изображения, которые нужно загрузить
    this.toLoad = {
      ground: "assets/images/sprites/ground-sheet.png",
      hero: "assets/images/sprites/hero/hero-sheet.png",
      goblinClub: "assets/images/sprites/enemies/goblinClub-sheet.png",
      health: "assets/images/sprites/gui/healthBar/Health.png",
      healthBar: "assets/images/sprites/gui/healthBar/Health_Bar.png",
      healthHeart: "assets/images/sprites/gui/healthBar/Health_Heart.png",
      xp: "assets/images/sprites/gui/xpBar/xp.png",
      xpBar: "assets/images/sprites/gui/xpBar/xpBar.png"
    };

    // Объект для хранения всех изображений
    this.images = {};

    // Загрузка каждого изображения
    Object.keys(this.toLoad).forEach(key => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false
      }
      img.onload = () => {
        this.images[key].isLoaded = true;
      }
    })
  }
}

// Один экземпляр для всего приложения
export const resources = new Resources();
