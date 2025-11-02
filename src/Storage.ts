import { Storage } from "@ionic/storage";

const store = new Storage();

// Remove the top-level await - initialize when first used
store.create().catch(console.error);

export default store;