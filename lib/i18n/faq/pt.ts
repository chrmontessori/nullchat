import type { FaqKey } from "../faq-translations";

export const pt: Record<FaqKey, string> = {
  faq_1_title: "O que é o nullchat?",
  faq_1_body: `nullchat é uma sala de bate-papo anônima com criptografia de ponta a ponta que não exige contas, e-mails, números de telefone nem qualquer informação pessoal. Você insere um segredo compartilhado — uma senha — e qualquer outra pessoa que inserir a mesma senha entra na mesma sala. Só isso.`,
  faq_2_title: "Como entro em uma sala?",
  faq_2_body: `Você e a pessoa com quem deseja conversar combinam um segredo compartilhado antecipadamente — pessoalmente, por ligação telefônica, como preferir. Ambos digitam esse segredo no nullchat e entram na mesma sala criptografada. Não existe lista de salas, diretório nem forma de navegar. Se você não sabe o segredo, a sala simplesmente não existe para você.`,
  faq_3_title: "Como devo escolher um segredo compartilhado?",
  faq_3_body: `Seu segredo compartilhado é a peça mais importante da sua segurança. Ele é ao mesmo tempo a chave da sua sala e a chave da sua criptografia — se alguém adivinhá-lo, poderá ler tudo. Trate-o como a senha de um cofre.

Escolha algo longo, aleatório e impossível de adivinhar. Um segredo forte tem pelo menos 5–6 palavras aleatórias ou mais de 20 caracteres variados. Evite nomes, datas, frases comuns, letras de músicas ou qualquer coisa que alguém possa encontrar nas suas redes sociais. Nunca reutilize um segredo em conversas ou salas diferentes.

Compartilhe seu segredo por um canal seguro e fora de banda — pessoalmente é o ideal. Uma ligação telefônica é aceitável. Nunca envie por mensagem de texto, e-mail, mensagem direta ou qualquer plataforma que registre mensagens. Se suspeitar que um segredo foi comprometido, pare de usá-lo imediatamente e combine um novo por um canal seguro.

O indicador de força na tela de entrada dá uma noção aproximada de quão resistente seu segredo é a ataques de força bruta, mas nenhum indicador substitui o bom senso. Em caso de dúvida, faça-o mais longo e mais aleatório.`,
  faq_4_title: "Como funciona a criptografia?",
  faq_4_body: `Quando você insere seu segredo compartilhado, duas coisas acontecem inteiramente no seu navegador:

1. O segredo é processado pelo Argon2id — uma função de derivação de chave com uso intensivo de memória — usando um salt separado por domínio para produzir um ID de sala. Esse hash é enviado ao servidor para que ele saiba a qual sala conectar você. O servidor nunca vê seu segredo real.

2. O segredo passa por uma segunda derivação Argon2id independente (64 MiB de memória, 3 iterações) para produzir uma chave de criptografia de 256 bits. Essa chave nunca sai do seu navegador. O Argon2id exige grandes blocos de RAM por tentativa, tornando ataques de força bruta com GPU e ASIC à sua senha ordens de magnitude mais difíceis do que KDFs tradicionais.

Cada mensagem que você envia é criptografada com NaCl secretbox (XSalsa20-Poly1305) usando essa chave antes de sair do seu dispositivo. O servidor recebe, armazena e retransmite apenas texto cifrado — blocos criptografados que não têm significado sem a chave. Nós não podemos ler suas mensagens. Ninguém pode, a menos que saiba o segredo compartilhado.`,
  faq_5_title: "O que o servidor vê?",
  faq_5_body: `O servidor vê:
• Um hash derivado por Argon2id (o ID da sala) — não a sua senha
• Blocos de texto cifrado criptografado — não as suas mensagens
• O número de conexões ativas em uma sala
• Carimbos de data/hora de quando os blocos criptografados foram recebidos

O servidor NÃO vê:
• Seu segredo compartilhado / senha
• O conteúdo das suas mensagens
• Sua identidade ou nome de usuário (os apelidos são criptografados dentro das mensagens)
• Seu endereço IP (removido na borda pelo nosso provedor de hospedagem)`,
  faq_6_title: "O que é o preenchimento de mensagens?",
  faq_6_body: `Antes da criptografia, cada mensagem é preenchida até um bloco fixo de 8.192 bytes usando um prefixo de comprimento de 2 bytes seguido pelo conteúdo da mensagem e ruído aleatório. Isso significa que uma mensagem curta como "oi" produz exatamente o mesmo tamanho de texto cifrado que uma mensagem no comprimento máximo. Sem preenchimento, um observador poderia adivinhar o conteúdo da mensagem com base no tamanho do texto cifrado. O preenchimento com ruído aleatório (não zeros) garante que não haja padrão distinguível no texto plano antes da criptografia. O preenchimento elimina esse canal lateral por completo.`,
  faq_7_title: "O que é a ofuscação de carimbos de data/hora?",
  faq_7_body: `Os carimbos de data/hora incluídos nas mensagens são arredondados para o minuto mais próximo antes da criptografia. Isso previne ataques de correlação temporal em que um observador poderia combinar padrões de mensagens entre canais diferentes comparando carimbos de data/hora exatos.`,
  faq_8_title: "Quanto tempo as mensagens duram?",
  faq_8_body: `As mensagens usam um sistema de temporizadores em camadas:

• Dead drop (primeira mensagem): Uma mensagem fica criptografada no servidor por até 24 horas, aguardando uma resposta. O remetente pode sair e voltar para verificar sem acionar nenhuma contagem regressiva. Simplesmente entrar na sala não destrói a mensagem.

• Ambos os usuários presentes: Quando uma segunda pessoa entra na sala, todas as mensagens não lidas iniciam imediatamente uma contagem regressiva de destruição de 5 minutos. Cada nova mensagem enviada enquanto ambos os usuários estão presentes também é destruída automaticamente em 5 minutos. Nenhuma ação é necessária — a presença por si só confirma que a mensagem está sendo lida.

• Botão Recebido: Se você pegar uma mensagem de dead drop enquanto estiver sozinho na sala, pode pressionar o botão "Recebido" para confirmar manualmente o recebimento e iniciar a destruição em 5 minutos. Este botão aparece apenas uma vez — durante a coleta inicial do dead drop — e não está disponível durante conversas ativas.

• Conversa ativa: Quando uma sala já teve respostas, mensagens subsequentes têm uma janela de 6 horas caso o destinatário não esteja presente. Se ambos os usuários estiverem conectados, as mensagens são destruídas automaticamente em 5 minutos.

• Limite máximo: Qualquer mensagem não lida é excluída após o término do seu temporizador (24 horas para dead drops, 6 horas para mensagens ativas), independentemente de ter sido confirmada.

Não há arquivo, backup nem forma de recuperar uma mensagem excluída.`,
  faq_9_title: "O que é o dead drop?",
  faq_9_body: `nullchat funciona como um dead drop digital. Na tradição da inteligência, um dead drop é um método de passar informações entre duas pessoas sem que elas precisem se encontrar ou estar no mesmo lugar ao mesmo tempo. O nullchat funciona da mesma forma.

Você insere o segredo compartilhado, deixa uma mensagem criptografada e desconecta. A mensagem fica no servidor — criptografada e ilegível por qualquer pessoa, incluindo nós — por até 24 horas. Seu contato insere o mesmo segredo quando estiver pronto e pega a mensagem. Quando o destinatário entra e ambos os usuários estão presentes, todas as mensagens em espera iniciam imediatamente uma contagem regressiva de destruição de 5 minutos — a presença por si só é prova de recebimento. Se o destinatário pegar a mensagem enquanto estiver sozinho, pode pressionar o botão único "Recebido" para confirmar manualmente o recebimento e iniciar a destruição, ou simplesmente responder. Quando a destruição começa, a mensagem é permanentemente eliminada após 5 minutos.

O remetente pode se reconectar com segurança a qualquer momento para verificar se sua mensagem ainda está esperando — sem acionar nenhuma contagem regressiva, desde que seja o único na sala. Nenhuma das partes precisa estar online ao mesmo tempo. Nenhuma das partes precisa de uma conta. Nenhuma das partes é identificável. O servidor nunca sabe quem deixou a mensagem ou quem a pegou — apenas que um bloco criptografado foi armazenado e depois recuperado. Após a destruição, não há evidência de que a troca sequer aconteceu.`,
  faq_10_title: "Quanto tempo as salas duram?",
  faq_10_body: `Uma sala existe enquanto tiver conexões ativas ou mensagens não expiradas. Quando a última pessoa desconecta e todas as mensagens expiraram ou foram destruídas, a sala desaparece. Não há estado persistente de sala. Se nenhuma mensagem for enviada, a sala é apenas uma conexão ao vivo — nada é armazenado e ela desaparece no momento em que todos saem.`,
  faq_11_title: "O que é o botão Encerrar?",
  faq_11_body: `Encerrar exclui imediatamente todas as mensagens que você enviou durante sua sessão atual do servidor para todos na sala. Outros participantes verão suas mensagens desaparecerem de suas telas em tempo real. Em seguida, você é desconectado da sala. Use isso se precisar sair sem deixar rastros.`,
  faq_12_title: "O que é o botão Sair?",
  faq_12_body: `Sair simplesmente desconecta você da sala. Suas mensagens permanecem no servidor — mensagens não lidas continuam aguardando (até 24 horas), e mensagens já lidas continuam sua contagem regressiva de destruição de 5 minutos. Se você entrar novamente na sala mais tarde, receberá um novo apelido aleatório — não há como vincular suas identidades antiga e nova.`,
  faq_13_title: "O que são os apelidos aleatórios?",
  faq_13_body: `Quando você entra em uma sala, recebe um código hexadecimal aleatório de 8 caracteres (como "a9f2b71c") como apelido. Esse apelido é gerado no seu navegador, criptografado dentro de cada mensagem e nunca é enviado ao servidor em texto plano. Se você desconectar e reconectar, recebe um novo apelido. Não há como reservar, escolher ou manter um apelido.`,
  faq_14_title: "Existe um limite de participantes?",
  faq_14_body: `Cada sala suporta até 50 conexões simultâneas. Se a sala estiver cheia, você verá uma mensagem "A sala está cheia". Este limite existe para manter as salas íntimas e prevenir abusos.`,
  faq_15_title: "Existe limitação de taxa?",
  faq_15_body: `Sim. Cada conexão é limitada a 1 mensagem por segundo. Isso previne spam e abusos sem exigir qualquer verificação de identidade. Se você enviar mensagens rápido demais, verá um breve aviso "Mais devagar".`,
  faq_16_title: "Posso acessar o nullchat pelo Tor?",
  faq_16_body_1: `nullchat está disponível como serviço oculto Tor para usuários em regiões censuradas ou qualquer pessoa que deseje uma camada adicional de anonimato. Abra o Tor Browser e navegue até:`,
  faq_16_body_2: `Por padrão, tanto a versão clearnet quanto a versão Tor se conectam ao mesmo backend — usuários em qualquer uma delas podem se comunicar entre si nas mesmas salas usando o mesmo segredo compartilhado. O serviço .onion é roteado pela rede Tor sem Cloudflare, sem CDN e sem infraestrutura de terceiros entre você e o servidor. O Tor roteia sua conexão por múltiplos relays criptografados, de modo que nem o servidor nem qualquer observador podem determinar seu endereço IP real ou localização. O serviço .onion usa HTTP simples, o que é esperado e seguro — o próprio Tor fornece criptografia de ponta a ponta entre seu navegador e o servidor. Toda a mesma criptografia em nível de aplicação (NaCl secretbox, derivação de chave Argon2id) se aplica por cima disso. Nota: O Tor Browser deve estar configurado no nível de segurança "Standard" para o nullchat funcionar, pois o aplicativo requer JavaScript.`,
  faq_17_title: "O que é uma sala exclusiva para Tor?",
  faq_17_body: `Ao acessar o nullchat pelo serviço oculto .onion, você tem a opção de ativar "Sala exclusiva para Tor" — um botão que aparece na tela de entrada de senha. Quando ativado, sua sala é colocada em um namespace separado que apenas outros usuários Tor com o mesmo botão ativado podem acessar. Usuários da clearnet nunca podem entrar em uma sala exclusiva para Tor, mesmo que saibam o segredo compartilhado.

Isso fornece um nível mais alto de segurança do que as salas compartilhadas padrão:

• Ambas as partes são roteadas pela rede onion multi-hop do Tor — o endereço IP real ou a localização de nenhuma das partes é visível para ninguém, incluindo o servidor.
• Nenhuma consulta DNS, nenhum CDN e nenhuma infraestrutura de terceiros toca a conexão em nenhum ponto.
• A análise de tráfego é significativamente mais difícil porque ambos os lados se beneficiam do preenchimento de relay do Tor combinado com o próprio preenchimento de conexão do nullchat (frames dummy aleatórios enviados em intervalos aleatórios).
• Não há participante na clearnet cujos metadados de conexão mais fracos possam ser correlacionados com a conversa.

Você é tão anônimo quanto o elo mais fraco da conversa. Em uma sala padrão, a conexão de um participante na clearnet toca resolvedores DNS, infraestrutura CDN e roteamento padrão da internet — todos os quais podem ser observados ou intimados para metadados sobre quem se conectou, quando e de onde. O botão de sala exclusiva para Tor elimina esse risco inteiramente ao garantir que cada participante tenha o mesmo nível de anonimato na camada de rede.

Ambas as partes devem concordar em ativar o botão — funciona da mesma forma que combinar o segredo compartilhado. O cabeçalho do chat exibe "APENAS TOR" em verde quando ativo, ou "CLEARNET" em vermelho para salas padrão, para que você sempre saiba em qual modo está.`,
  faq_18_title: "O que é o tempo limite de inatividade?",
  faq_18_body: `Se você ficar inativo por 15 minutos — sem digitar, sem tocar, sem rolar — o nullchat desconectará você automaticamente e retornará à tela de entrada de senha. Um aviso aparece aos 13 minutos dando a opção de permanecer. Isso protege sua sessão caso você se afaste do seu dispositivo, evitando que mensagens sejam destruídas enquanto ninguém está lendo ativamente e garantindo que o chat não fique visível em uma tela sem supervisão.`,
  faq_19_title: "E quanto aos endereços IP?",
  faq_19_body: `Na clearnet (nullchat.org), o aplicativo é hospedado na rede de borda da Cloudflare. Seu endereço IP é tratado na camada de infraestrutura e nunca é lido, registrado ou armazenado pelo código do aplicativo. O código do servidor não acessa cabeçalhos de IP. Não temos mecanismo para identificá-lo por endereço de rede.

No serviço oculto Tor (.onion), seu endereço IP nunca é visível para o servidor — o roteamento onion do Tor garante anonimato completo na camada de rede. O servidor vê apenas conexões da rede Tor, sem forma de rastreá-las até você.`,
  faq_20_title: "Existem cookies ou rastreadores?",
  faq_20_body: `Não. O nullchat não define cookies, não usa analytics, não carrega scripts de terceiros, não incorpora pixels de rastreamento e não faz requisições externas. Os cabeçalhos de Content Security Policy impõem isso no nível do navegador. Você pode verificar isso nas ferramentas de desenvolvedor do seu navegador.`,
  faq_21_title: "Por que não consigo enviar links, imagens ou arquivos?",
  faq_21_body: `Por design. O nullchat é apenas texto — nenhum link, imagem, anexo de arquivo ou mídia de qualquer tipo pode ser enviado ou renderizado. Esta é uma decisão deliberada de segurança, não uma limitação. Links clicáveis e mídia incorporada são a principal superfície de ataque para exploits zero-day usados por spyware comercial como Pegasus, Predator e ferramentas de vigilância similares. Um único link ou arquivo malicioso pode comprometer silenciosamente um dispositivo inteiro. Ao reduzir o chat a apenas texto plano, o nullchat elimina esse vetor de ataque inteiramente. Não há nada para clicar, nada para baixar e nada para renderizar — o que significa nada para explorar.`,
  faq_22_title: "Posso copiar ou fazer capturas de tela das mensagens?",
  faq_22_body: `O nullchat desencoraja ativamente a captura de conteúdo de mensagens. A seleção e cópia de texto são desativadas na área do chat, menus de contexto do clique direito são bloqueados e atalhos de teclado comuns para capturas de tela são interceptados. A API de captura de tela do navegador também é bloqueada via cabeçalhos Permissions-Policy, impedindo que ferramentas de gravação de tela baseadas em web capturem a página.

Essas são proteções baseadas em fricção, não garantias absolutas. Um usuário determinado sempre pode fotografar sua tela com outro dispositivo ou usar ferramentas no nível do sistema operacional que contornam as restrições do navegador. O objetivo é tornar a captura casual difícil e reforçar a expectativa de que conversas no nullchat não devem ser salvas.`,
  faq_23_title: "O que é tráfego de cobertura?",
  faq_23_body: `O nullchat envia automaticamente mensagens dummy criptografadas em intervalos aleatórios (a cada 10–60 segundos) enquanto você está conectado a uma sala. Essas mensagens de cobertura são indistinguíveis das mensagens reais — têm o mesmo tamanho (graças ao preenchimento fixo), são criptografadas com a mesma chave e retransmitidas pelo mesmo caminho do servidor. O cliente do destinatário as descarta silenciosamente após a descriptografia.

O tráfego de cobertura derrota a análise de tráfego. Sem ele, um observador monitorando o tráfego de rede poderia determinar quando uma comunicação real está acontecendo com base em quando blocos criptografados são enviados. Com a cobertura, há um fluxo constante de tráfego com aparência idêntica, independentemente de alguém estar realmente digitando — tornando impossível distinguir mensagens reais de ruído.`,
  faq_24_title: "O que é preenchimento de conexão?",
  faq_24_body: `O servidor envia frames binários de comprimento aleatório (64–512 bytes de dados aleatórios) para cada cliente conectado em intervalos aleatórios (a cada 5–30 segundos). Esses frames não são mensagens — são puro ruído que o cliente ignora silenciosamente. Combinado com o tráfego de cobertura do lado do cliente, o preenchimento de conexão garante que os padrões de tráfego de rede não revelem nada sobre se uma comunicação real está ocorrendo, quantas mensagens estão sendo trocadas ou quando os participantes estão ativos.`,
  faq_25_title: "O que é a tecla de pânico?",
  faq_25_body: `Pressionar a tecla Escape três vezes rapidamente limpa sua sessão instantaneamente. Quando acionado, o nullchat envia um comando de encerramento ao servidor (excluindo todas as suas mensagens), fecha a conexão WebSocket, zera a chave de criptografia na memória, limpa o DOM, apaga sessionStorage e localStorage, limpa a área de transferência e redireciona seu navegador para google.com. Todo o processo leva menos de um segundo. Se o navegador tentar restaurar a página do cache (por exemplo, pelo botão voltar), a limpeza é acionada automaticamente novamente. Use isso se precisar apagar imediatamente todas as evidências da conversa da sua tela e navegador.`,
  faq_26_title: "O que é o modo esteganográfico?",
  faq_26_body: `O modo esteganográfico disfarça a interface do nullchat como um editor de documentos. Pressione Shift cinco vezes rapidamente para ativá-lo. Toda a interface se transforma — a interface escura do chat é substituída por uma interface de edição de documentos familiar, completa com barra de ferramentas e barra de menu. As mensagens aparecem como parágrafos no corpo do documento e sua entrada se mistura como digitação ativa. Toda a criptografia, temporizadores de destruição e recursos de segurança continuam operando normalmente por baixo.

Isso é útil se alguém estiver olhando por cima do seu ombro ou se sua tela estiver visível para outros. À primeira vista, parece que você está editando um documento, não tendo uma conversa criptografada. Pressione Shift cinco vezes novamente para retornar à visualização normal do chat.`,
  faq_27_title: "O nullchat limpa a área de transferência automaticamente?",
  faq_27_body: `Sim. Se algo for copiado enquanto você está em uma sala de chat, o nullchat limpa automaticamente sua área de transferência após 15 segundos. A área de transferência também é apagada quando você fecha a aba ou navega para fora, e imediatamente se você usar a tecla de pânico. Isso evita que conteúdo de mensagens permaneça na sua área de transferência após sair da conversa.`,
  faq_28_title: "Vocês podem ler minhas mensagens?",
  faq_28_body: `Não. O servidor é um simples retransmissor. Ele recebe blocos criptografados e os encaminha. A chave de criptografia é derivada do seu segredo compartilhado, que nunca sai do seu navegador. Nós não temos a chave. Não podemos descriptografar os blocos. Mesmo que o servidor fosse comprometido, o atacante obteria apenas texto cifrado sem significado.`,
  faq_29_title: "Agências governamentais podem acessar minhas mensagens?",
  faq_29_body: `Não podemos fornecer o que não temos. Não há mensagens em texto plano armazenadas em lugar nenhum. Não há contas de usuário para consultar. Não há registros de IP para entregar. Os blocos criptografados são excluídos automaticamente em um cronograma fixo. Mesmo sob uma ordem judicial válida, o máximo que poderíamos produzir é uma coleção de blocos criptografados e hashes de salas — nenhum dos quais é útil sem o segredo compartilhado que apenas os participantes conhecem.`,
  faq_30_title: "O nullchat é código aberto?",
  faq_30_body_1: `Sim. Todo o código-fonte — cliente, servidor, criptografia e configuração de infraestrutura — está publicamente disponível para auditoria em`,
  faq_30_body_2: `. Você pode verificar que o código em execução no servidor corresponde ao que foi publicado, compilá-lo você mesmo ou hospedar sua própria instância. Transparência não é opcional para uma ferramenta que pede que você confie nela com suas comunicações privadas.`,
  faq_31_title: "Quem construiu o nullchat?",
  faq_31_body_1: `nullchat é construído pela Artorias — uma empresa de tecnologia de inteligência operada por veteranos, sediada em Nova York. A Artorias existe para desmantelar sistemas ultrapassados e equipar as organizações e indivíduos mais importantes com ferramentas construídas especificamente para operar nas sombras. Em sua essência, a Artorias busca democratizar a inteligência e o anonimato — garantindo que a capacidade de se comunicar com segurança e operar sem vigilância não seja um privilégio reservado para poucos. O nullchat é uma expressão dessa missão: comunicação segura reduzida à sua essência, sem comprometer a integridade criptográfica. Saiba mais em`,

};
