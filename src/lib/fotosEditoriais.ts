// O Vite só inclui fotos entregues na publicação, evitando pedidos para arquivos ausentes.
const fotos = import.meta.glob<string>('/src/fotos/{casas,cidades}/*.jpg', {
  eager: true, query: '?url', import: 'default',
});

export function fotoDaCasa(casa: number) {
  return fotos[`/src/fotos/casas/casa-${String(casa).padStart(2, '0')}.jpg`];
}

export function fotoDaCidade(cidade: string) {
  const nome = cidade.split(',')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return fotos[`/src/fotos/cidades/${nome}.jpg`];
}
