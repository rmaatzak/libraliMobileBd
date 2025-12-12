// services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para cada região
const STORAGE_KEYS = {
  NORTE: 'progresso_norte',
  SUL: 'progresso_sul',
  CENTRO: 'progresso_centro',
};

// Salvar progresso de uma região
export const salvarProgresso = async (regiao, faseConcluida) => {
  try {
    const chave = STORAGE_KEYS[regiao.toUpperCase()];
    await AsyncStorage.setItem(chave, faseConcluida.toString());
    console.log(`Progresso salvo: ${regiao} - fase ${faseConcluida}`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return false;
  }
};

// Carregar progresso de uma região
export const carregarProgresso = async (regiao) => {
  try {
    const chave = STORAGE_KEYS[regiao.toUpperCase()];
    const progresso = await AsyncStorage.getItem(chave);
    return progresso ? parseInt(progresso) : 0;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return 0;
  }
};

// Limpar todo o progresso (para testes)
export const limparProgresso = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Erro ao limpar progresso:', error);
    return false;
  }
};