file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_mobile_btn = '''onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, area.id]); }}'''
new_mobile_btn = '''onClick={async (e) => { 
                                      e.stopPropagation(); 
                                      if (P.onUnlockFocus) {
                                        setUnlockingFocus(area.id);
                                        try {
                                          await P.onUnlockFocus(area.id, P_DYNAMIC.house);
                                        } catch(err) {}
                                        finally { setUnlockingFocus(null); }
                                      } else {
                                        setUnlockedItems(prev => [...prev, area.id]); 
                                      }
                                    }}
                                    disabled={unlockingFocus === area.id}'''

content = content.replace(old_mobile_btn, new_mobile_btn)

# Also fix the text in mobile button
content = content.replace(
    '{unlockingFocus === activeArea.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}',
    'Desbloquear com 1 Crédito' # Reset the global replace bug from before
)
content = content.replace(
    '''<CreditCard className="w-4 h-4" />
    Desbloquear com 1 Crédito
  </button>''',
    '''<CreditCard className="w-4 h-4" />
    {unlockingFocus === area.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}
  </button>'''
)

content = content.replace(
    '''<CreditCard className="w-4 h-4 shrink-0" />
                                Desbloquear com 1 Crédito
                              </button>''',
    '''<CreditCard className="w-4 h-4 shrink-0" />
                                {unlockingFocus === activeArea.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}
                              </button>'''
)

with open(file_path, "w") as f:
    f.write(content)

