# LP Honcord

Landing page da Honcord — centro de onco-hematologia, hemoterapia e banco de sangue em Goiânia.

## Estrutura

- `index.html` — página completa e autossuficiente (HTML único com todos os recursos embutidos). É o arquivo publicado no GitHub Pages.
- `doacao-de-sangue-goiania.html` — LP de Doação de Sangue (conversão via WhatsApp, sem formulário).
- `hematologista-goiania.html` — LP de Hematologia e Hemoterapia (conversão via WhatsApp + formulário).
- `oncologia-goiania.html` — LP de Oncologia Clínica (conversão via WhatsApp + formulário).
- `assets/logo.png` — logo Honcord em vermelho institucional (usado nas três LPs novas).
- `assets/hero.jpg` — foto original do hero (também está embutida dentro do `index.html`).
- `assets/sala-infusao.png` — foto da sala de infusão, usada nas seções "Diferenciais" (hematologia) e "Estrutura" (oncologia).

As três LPs novas seguem a copy dos documentos `[HONCORD] LP ... - AGO26.docx`. Trechos pendentes de validação aparecem na página como marcadores âmbar `[VALIDAR ...]` — nada disso deve ir ao ar sem substituição.

## Publicação

Servida via GitHub Pages a partir da branch `main` (raiz do repositório). Qualquer commit na `main` republica a página automaticamente.

## Pendências de conteúdo

- Logos reais dos convênios na faixa de credibilidade.
- Nota e volume reais das avaliações do Google.
- Depoimentos reais (com autorização por escrito).
- Nome, CRM do diretor técnico, CNES e razão social no rodapé/página, conforme necessidade.
- Número de WhatsApp definitivo (propriedade `whatsappNumber` do template; nas LPs novas, a constante `WHATSAPP_NUMBER` no `<script>` de cada arquivo).
- Nas LPs novas: dados marcados em âmbar (idade/peso mínimos, tempo de atendimento, telefone, estacionamento, números de especialistas/pacientes/convênios) e validação técnica/clínica dos textos indicados nos documentos.
- Integração dos formulários (hematologia e oncologia) com o destino real dos leads — hoje o envio só exibe a confirmação na tela.
- Fotos de hero conforme direção de imagem dos documentos (doador acolhido; consulta hematologista + paciente; médico com paciente e familiar).

Desenvolvido por 3ADS.
