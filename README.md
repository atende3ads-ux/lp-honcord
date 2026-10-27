# LP Honcord

Landing page da Honcord — centro de onco-hematologia, hemoterapia e banco de sangue em Goiânia.

## Estrutura

- `index.html` — página completa e autossuficiente (HTML único com todos os recursos embutidos). É o arquivo publicado no GitHub Pages.
- `doacao-de-sangue-goiania.html` — LP de Doação de Sangue (contato via SPAR, sem formulário).
- `hematologista-goiania.html` — LP de Hematologia e Hemoterapia (contato via SPAR + formulário demonstrativo).
- `oncologia-goiania.html` — LP de Oncologia Clínica (contato via SPAR + formulário demonstrativo).
- `assets/logo.png` — logo Honcord em vermelho institucional (usado nas três LPs novas).
- `assets/hero.jpg` — foto original do hero (também está embutida dentro do `index.html`).
- `assets/hero-onco-stock.jpg` — imagem de banco usada no hero de Oncologia. Foto “A medical professional sitting next to two women hugging”, de Thirdman, via Pexels: https://www.pexels.com/photo/a-medical-professional-sitting-next-to-two-women-hugging-7659688/. Licença Pexels permite uso gratuito em sites; crédito é opcional. Imagem redimensionada para 1920 px de largura.
- `assets/sala-infusao.png` — foto da sala de infusão, usada nas seções "Diferenciais" (hematologia) e "Estrutura" (oncologia).

As três LPs novas seguem a copy dos documentos `[HONCORD] LP ... - AGO26.docx`. Trechos pendentes de validação aparecem na página como marcadores âmbar `[VALIDAR ...]` — nada disso deve ir ao ar sem substituição.

## Publicação

Servida via GitHub Pages a partir da branch `main` (raiz do repositório). Qualquer commit na `main` republica a página automaticamente.

## Pendências de conteúdo

- Os nomes dos 17 convênios foram inseridos na LP de Oncologia; os arquivos oficiais de logotipo ainda podem substituir os cards textuais quando forem disponibilizados.
- Nota e volume reais das avaliações do Google. Esses números não são exibidos enquanto não houver confirmação.
- Nome, CRM do diretor técnico, CNES e razão social no rodapé/página, conforme necessidade. (Site oficial informa: Diretor Técnico Médico Dr. Frederico Saddi Teixeira - CRM/GO 9045 | RQE 7614.)
- Links de contato: Hematologia e Oncologia direcionam ao WhatsApp `https://api.whatsapp.com/send/?phone=556232396600`; Doação de Sangue continua no redirecionador SPAR.
- Nas LPs novas, dados preenchidos a partir de honcord.com.br e das validações internas: idade 16-69, peso mínimo 50kg, telefone/WhatsApp, endereço do banco de sangue, 35 especialistas, mais de 30 mil pacientes atendidos e 17 convênios atendidos. Permanecem pendentes apenas os marcadores não contemplados pelas validações recebidas.
- Integração dos formulários (hematologia e oncologia) com o destino real dos leads — hoje o envio só exibe a confirmação na tela.
- Fotos de hero conforme direção de imagem dos documentos (doador acolhido; consulta hematologista + paciente; médico com paciente e familiar).

Desenvolvido por 3ADS.
