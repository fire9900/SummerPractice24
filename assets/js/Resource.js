class Resources {
  constructor() {
    // Все изображения, которые нужно загрузить
    this.toLoad = {
      // sky: "/sprites/sky.png",
      ground: "assets/images/sprites/ground-sheet.png",
      // hero: "/sprites/hero-sheet.png",
      // shadow: "/sprites/shadow.png",
      // rod: "/sprites/rod.png",
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
