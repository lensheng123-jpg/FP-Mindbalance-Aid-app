import storage from '../Storage';

export const debugStorage = async () => {
  try {
    const keys = await storage.keys();
    console.log('📦 All storage keys:', keys);
    
    const proKeys = keys.filter(key => key.startsWith('isPro_'));
    console.log('🔑 Pro status keys:', proKeys);
    
    for (const key of proKeys) {
      const value = await storage.get(key);
      console.log(`   ${key}:`, value);
    }
    
    return { keys, proKeys };
  } catch (error) {
    console.error('Error debugging storage:', error);
    return null;
  }
};

export const clearAllProStatus = async () => {
  try {
    const keys = await storage.keys();
    const proKeys = keys.filter(key => key.startsWith('isPro_'));
    
    for (const key of proKeys) {
      await storage.remove(key);
      console.log(`🗑️ Cleared: ${key}`);
    }
    
    console.log('✅ All Pro status data cleared!');
    return proKeys.length;
  } catch (error) {
    console.error('Error clearing Pro status:', error);
    return 0;
  }
};