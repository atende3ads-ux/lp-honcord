# LP Honcord

Landing page da Honcord — centro de onco-hematologia, hemoterapia e banco de sangue em Goiânia.

## Estrutura

- `index.html` — página completa e autossuficiente (HTML único com todos os recursos embutidos). É o arquivo publicado no GitHub Pages.
- `doacao-de-sangue-goiania.html` — LP de Doação de Sangue (contato via SPAR, sem formulário).
- `hematologista-goiania.html` — LP de Hematologia e Hemoterapia (WhatsApp + formulário).
- `oncologia-goiania.html` — LP de Oncologia Clínica (WhatsApp + formulário).
- `assets/logo.png` — logo Honcord em vermelho institucional (usado nas três LPs novas).
- `assets/hero.jpg` — foto original do hero (também está embutida dentro do `index.html`).
- `assets/hero-onco-stock.jpg` — imagem de banco usada no hero de Oncologia. Foto “A medical professional sitting next to two women hugging”, de Thirdman, via Pexels: https://www.pexels.com/photo/a-medical-professional-sitting-next-to-two-women-hugging-7659688/. Licença Pexels permite uso gratuito em sites; crédito é opcional. Imagem redimensionada para 1920 px de largura.
- `assets/sala-infusao.jpg` — versão otimizada da foto da sala de infusão, usada nas seções "Diferenciais" (hematologia) e "Estrutura" (oncologia); o PNG original permanece como fonte no repositório.

As três LPs seguem a copy dos documentos `[HONCORD] LP ... - AGO26.docx`. Os pontos de conteúdo ainda dependentes de material oficial estão listados abaixo.

## Publicação

Servida via GitHub Pages a partir da branch `main` (raiz do repositório). Qualquer commit na `main` republica a página automaticamente.

O deploy no cPanel mantém `/doacao-de-sangue/` e publica `/oncologia/` no subdomínio `saude.honcord.com.br`. A LP de Hematologia **não está no deploy**: o conteúdo ainda traz o marcador `[VALIDAÇÃO CLÍNICA OBRIGATÓRIA antes da publicação.]`. Após revisão clínica, remover o marcador e `noindex` e acrescentar a cópia da página e seus assets à `.cpanel.yml`. Os arquivos da primeira tentativa foram preservados fora do document root em `/home2/hg3ads37/honcord-hematologista-pendente-validacao-clinica` (permissão `0700`). O formulário nas páginas de GitHub Pages não envia dados; ele funciona apenas no domínio oficial.

O endpoint `honcord-lead.php` valida os dados e encaminha ao Apps Script vinculado à planilha privada “Honcord - Leads Hematologia e Oncologia” de `atendimento.3ads@gmail.com`. O URL do web app fica exclusivamente em `/home2/hg3ads37/.config/honcord-leads.php`, fora da pasta pública e do Git, com permissão `0600`. O deploy exige esse arquivo antes de copiar as LPs. Nenhum formulário confirma recebimento sem resposta positiva do servidor. A planilha registra LP, nome, WhatsApp, convênio, motivo e parâmetros de campanha; os testes devem usar dados sintéticos identificados como `TESTE`.

## Pendências de conteúdo

- Os nomes dos 17 convênios foram inseridos na LP de Oncologia; os arquivos oficiais de logotipo ainda podem substituir os cards textuais quando forem disponibilizados.
- Nota e volume reais das avaliações do Google. Esses números não são exibidos enquanto não houver confirmação.
- Nome, CRM do diretor técnico, CNES e razão social no rodapé/página, conforme necessidade. (Site oficial informa: Diretor Técnico Médico Dr. Frederico Saddi Teixeira - CRM/GO 9045 | RQE 7614.)
- Links de contato: Hematologia e Oncologia direcionam ao WhatsApp `https://api.whatsapp.com/send/?phone=556232396600`; Doação de Sangue continua no redirecionador SPAR.
- Nas LPs novas, dados preenchidos a partir de honcord.com.br e das validações internas: idade 16-69, peso mínimo 50kg, telefone/WhatsApp, endereço do banco de sangue, 35 especialistas, mais de 30 mil pacientes atendidos e 17 convênios atendidos. Conferir periodicamente esses dados com a Honcord.
- A integração Apps Script → planilha e o formulário de Oncologia foram validados com dados sintéticos, removidos da planilha após o teste. Falta a validação clínica da LP de Hematologia antes de publicá-la.
- Fotos de hero conforme direção de imagem dos documentos (doador acolhido; consulta hematologista + paciente; médico com paciente e familiar).

Desenvolvido por 3ADS.
