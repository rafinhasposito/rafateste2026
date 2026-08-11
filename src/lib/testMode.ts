/**
 * MODO DE TESTE — permite usar o site sem login e sem cobrar créditos.
 * Troque para `false` para voltar ao comportamento normal (login + créditos).
 */
export const TEST_MODE = true;

export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const GUEST_PROFILE = {
  display_name: "Convidado (Teste)",
  avatar_url: null as string | null,
  email: "teste@local",
  credits: 9999,
};

const LOCAL_PREFIX = "local-";

export const isLocalConsultationId = (id?: string | null) =>
  !!id && id.startsWith(LOCAL_PREFIX);

export const newLocalConsultationId = () =>
  `${LOCAL_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const storageKey = (id: string) => `test-consultation:${id}`;

export const saveLocalConsultation = (id: string, row: any) => {
  try {
    sessionStorage.setItem(storageKey(id), JSON.stringify(row));
  } catch {
    /* ignore */
  }
};

export const loadLocalConsultation = (id: string): any | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
