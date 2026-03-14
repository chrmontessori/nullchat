import type { FaqKey } from "../faq-translations";

export const es: Record<FaqKey, string> = {
  faq_1_title: "¿Qué es nullchat?",
  faq_1_body: `nullchat es una sala de chat anónima con cifrado de extremo a extremo que no requiere cuentas, correos electrónicos, números de teléfono ni información personal de ningún tipo. Introduces un secreto compartido — una contraseña — y cualquier otra persona que introduzca la misma contraseña entra en la misma sala. Eso es todo.`,
  faq_2_title: "¿Cómo me uno a una sala?",
  faq_2_body: `Tú y la persona con la que quieres hablar acuerdan un secreto compartido de antemano — en persona, por teléfono, como prefieran. Ambos escriben ese secreto en nullchat y entran en la misma sala cifrada. No hay lista de salas, ni directorio, ni forma de explorar. Si no conoces el secreto, la sala no existe para ti.`,
  faq_3_title: "¿Cómo debo elegir un secreto compartido?",
  faq_3_body: `Tu secreto compartido es el elemento más importante de tu seguridad. Es tanto la llave de tu sala como la llave de tu cifrado — si alguien lo adivina, puede leer todo. Trátalo como la contraseña de una caja fuerte.

Elige algo largo, aleatorio e imposible de adivinar. Un secreto fuerte tiene al menos 5–6 palabras aleatorias o más de 20 caracteres mixtos. Evita nombres, fechas, frases comunes, letras de canciones o cualquier cosa que alguien pueda encontrar en tus redes sociales. Nunca reutilices un secreto en diferentes conversaciones o salas.

Comparte tu secreto a través de un canal seguro fuera de banda — en persona es lo mejor. Una llamada telefónica es aceptable. Nunca lo envíes por mensaje de texto, correo electrónico, mensaje directo o cualquier plataforma que registre mensajes. Si sospechas que un secreto ha sido comprometido, deja de usarlo inmediatamente y acuerda uno nuevo a través de un canal seguro.

El indicador de fortaleza en la pantalla de entrada te da una idea aproximada de la resistencia de tu secreto ante ataques de fuerza bruta, pero ningún indicador sustituye al buen criterio. En caso de duda, hazlo más largo y más aleatorio.`,
  faq_4_title: "¿Cómo funciona el cifrado?",
  faq_4_body: `Cuando introduces tu secreto compartido, ocurren dos cosas enteramente en tu navegador:

1. El secreto se procesa a través de Argon2id — una función de derivación de claves con uso intensivo de memoria — utilizando una sal separada por dominio para producir un ID de sala. Este hash se envía al servidor para que sepa a qué sala conectarte. El servidor nunca ve tu secreto real.

2. El secreto se procesa a través de una segunda derivación independiente de Argon2id (64 MiB de memoria, 3 iteraciones) para producir una clave de cifrado de 256 bits. Esta clave nunca sale de tu navegador. Argon2id requiere grandes bloques de RAM por intento, lo que hace que los ataques de fuerza bruta con GPU y ASIC contra tu contraseña sean órdenes de magnitud más difíciles que con funciones KDF tradicionales.

Cada mensaje que envías se cifra con NaCl secretbox (XSalsa20-Poly1305) usando esa clave antes de salir de tu dispositivo. El servidor recibe, almacena y retransmite únicamente texto cifrado — bloques cifrados que no tienen sentido sin la clave. No podemos leer tus mensajes. Nadie puede, a menos que conozca el secreto compartido.`,
  faq_5_title: "¿Qué ve el servidor?",
  faq_5_body: `El servidor ve:
• Un hash derivado de Argon2id (el ID de sala) — no tu contraseña
• Bloques de texto cifrado — no tus mensajes
• El número de conexiones activas en una sala
• Marcas de tiempo de cuándo se recibieron los bloques cifrados

El servidor NO ve:
• Tu secreto compartido / contraseña
• El contenido de tus mensajes
• Tu identidad o nombre de usuario (los alias están cifrados dentro de los mensajes)
• Tu dirección IP (eliminada en el borde por nuestro proveedor de alojamiento)`,
  faq_6_title: "¿Qué es el relleno de mensajes?",
  faq_6_body: `Antes del cifrado, cada mensaje se rellena hasta un bloque fijo de 8.192 bytes usando un prefijo de longitud de 2 bytes seguido del contenido del mensaje y ruido aleatorio. Esto significa que un mensaje corto como "hola" produce un texto cifrado del mismo tamaño exacto que un mensaje de longitud máxima. Sin relleno, un observador podría adivinar el contenido del mensaje basándose en la longitud del texto cifrado. El relleno con ruido aleatorio (no ceros) asegura que no haya un patrón distinguible en el texto plano antes del cifrado. El relleno elimina este canal lateral por completo.`,
  faq_7_title: "¿Qué es la ofuscación de marcas de tiempo?",
  faq_7_body: `Las marcas de tiempo incluidas en los mensajes se redondean al minuto más cercano antes del cifrado. Esto previene ataques de correlación temporal en los que un observador podría emparejar patrones de mensajes entre diferentes canales comparando marcas de tiempo exactas.`,
  faq_8_title: "¿Cuánto duran los mensajes?",
  faq_8_body: `Los mensajes usan un sistema de temporizadores por niveles:

• Dead drop (primer mensaje): Un mensaje permanece cifrado en el servidor hasta 24 horas, esperando una respuesta. El remitente puede salir y volver a verificar sin activar ninguna cuenta regresiva. Simplemente entrar a la sala no destruye el mensaje.

• Ambos usuarios presentes: Cuando una segunda persona se une a la sala, todos los mensajes no leídos inician inmediatamente una cuenta regresiva de destrucción de 5 minutos. Cada mensaje nuevo enviado mientras ambos usuarios están presentes también se autodestruye en 5 minutos. No se requiere ninguna acción — la presencia sola confirma que el mensaje está siendo leído.

• Botón de Recibido: Si recoges un mensaje dead drop mientras estás solo en la sala, puedes pulsar el botón "Recibido" para confirmar manualmente la recepción e iniciar la destrucción de 5 minutos. Este botón aparece solo una vez — durante la recogida inicial del dead drop — y no está disponible durante conversaciones activas.

• Conversación activa: Una vez que la sala ha tenido respuestas, los mensajes posteriores tienen una ventana de 6 horas si el destinatario no está presente. Si ambos usuarios están conectados, los mensajes se destruyen en 5 minutos automáticamente.

• Límite máximo: Cualquier mensaje no leído se elimina cuando su temporizador expira (24 horas para dead drops, 6 horas para mensajes activos) independientemente de si fue confirmado.

No hay archivo, no hay copia de seguridad, no hay forma de recuperar un mensaje eliminado.`,
  faq_9_title: "¿Qué es el dead drop?",
  faq_9_body: `nullchat funciona como un dead drop digital. En el oficio de inteligencia tradicional, un dead drop es un método para pasar información entre dos personas sin que necesiten reunirse ni estar en el mismo lugar al mismo tiempo. nullchat funciona de la misma manera.

Introduces el secreto compartido, dejas un mensaje cifrado y te desconectas. El mensaje permanece en el servidor — cifrado e ilegible por cualquiera, incluyéndonos — hasta 24 horas. Tu contacto introduce el mismo secreto cuando esté listo y recoge el mensaje. Cuando el destinatario se une y ambos usuarios están presentes, todos los mensajes en espera inician inmediatamente una cuenta regresiva de destrucción de 5 minutos — la presencia sola es prueba de recepción. Si el destinatario recoge el mensaje mientras está solo, puede pulsar el botón único "Recibido" para confirmar manualmente la recepción e iniciar la destrucción, o simplemente responder. Una vez que comienza la destrucción, el mensaje se destruye permanentemente después de 5 minutos.

El remitente puede reconectarse de forma segura en cualquier momento para verificar si su mensaje sigue esperando — sin activar ninguna cuenta regresiva, siempre que sea la única persona en la sala. Ninguna de las partes necesita estar en línea al mismo tiempo. Ninguna de las partes necesita una cuenta. Ninguna de las partes es identificable. El servidor nunca sabe quién dejó el mensaje ni quién lo recogió — solo que un bloque cifrado fue almacenado y luego recuperado. Después de la destrucción, no hay evidencia de que el intercambio haya ocurrido.`,
  faq_10_title: "¿Cuánto duran las salas?",
  faq_10_body: `Una sala existe mientras tenga conexiones activas o mensajes sin expirar. Una vez que la última persona se desconecta y todos los mensajes han expirado o se han destruido, la sala desaparece. No hay estado persistente de sala. Si nunca se envían mensajes, la sala es solo una conexión en vivo — no se almacena nada, y desaparece en el momento en que todos se van.`,
  faq_11_title: "¿Qué es el botón Terminar?",
  faq_11_body: `Terminar elimina inmediatamente todos los mensajes que enviaste durante tu sesión actual del servidor para todos en la sala. Los demás participantes verán tus mensajes desaparecer de su pantalla en tiempo real. Luego serás desconectado de la sala. Úsalo si necesitas irte sin dejar rastro.`,
  faq_12_title: "¿Qué es el botón Salir?",
  faq_12_body: `Salir simplemente te desconecta de la sala. Tus mensajes permanecen en el servidor — los mensajes no leídos siguen esperando (hasta 24 horas) y los mensajes ya leídos continúan su cuenta regresiva de destrucción de 5 minutos. Si vuelves a entrar a la sala más tarde, obtendrás un nuevo alias aleatorio — no hay forma de vincular tu identidad antigua con la nueva.`,
  faq_13_title: "¿Qué son los alias aleatorios?",
  faq_13_body: `Cuando entras a una sala, se te asigna un código hexadecimal aleatorio de 8 caracteres (como "a9f2b71c") como tu alias. Este alias se genera en tu navegador, se cifra dentro de cada mensaje y nunca se envía al servidor en texto plano. Si te desconectas y vuelves a conectarte, obtienes un nuevo alias. No hay forma de reservar, elegir o mantener un alias.`,
  faq_14_title: "¿Hay un límite de participantes?",
  faq_14_body: `Cada sala admite hasta 50 conexiones simultáneas. Si la sala está llena, verás un mensaje de "La sala está llena". Este límite existe para mantener las salas íntimas y prevenir el abuso.`,
  faq_15_title: "¿Hay limitación de velocidad?",
  faq_15_body: `Sí. Cada conexión está limitada a 1 mensaje por segundo. Esto previene el spam y el abuso sin requerir ninguna verificación de identidad. Si envías mensajes demasiado rápido, verás un breve aviso de "Más despacio".`,
  faq_16_title: "¿Puedo acceder a nullchat a través de Tor?",
  faq_16_body_1: `nullchat está disponible como servicio oculto de Tor para usuarios en regiones censuradas o cualquier persona que desee una capa adicional de anonimato. Abre Tor Browser y navega a:`,
  faq_16_body_2: `Por defecto, tanto la versión clearnet como la de Tor se conectan al mismo backend — los usuarios en cualquiera de las dos pueden comunicarse entre sí en las mismas salas usando el mismo secreto compartido. El servicio .onion se enruta a través de la red de Tor sin Cloudflare, sin CDN y sin infraestructura de terceros entre tú y el servidor. Tor enruta tu conexión a través de múltiples relés cifrados, de modo que ni el servidor ni ningún observador pueden determinar tu dirección IP real o ubicación. El servicio .onion usa HTTP plano, lo cual es esperado y seguro — Tor en sí proporciona cifrado de extremo a extremo entre tu navegador y el servidor. Todo el mismo cifrado a nivel de aplicación (NaCl secretbox, derivación de claves Argon2id) se aplica encima de eso. Nota: Tor Browser debe estar configurado en el nivel de seguridad "Standard" para que nullchat funcione, ya que la aplicación requiere JavaScript.`,
  faq_17_title: "¿Qué es una sala solo para Tor?",
  faq_17_body: `Al acceder a nullchat a través del servicio oculto .onion, tienes la opción de activar "Sala solo para Tor" — un interruptor que aparece en la pantalla de entrada de contraseña. Cuando está activado, tu sala se coloca en un espacio de nombres separado al que solo pueden acceder otros usuarios de Tor con el mismo interruptor activado. Los usuarios de clearnet nunca pueden unirse a una sala solo para Tor, incluso si conocen el secreto compartido.

Esto proporciona un nivel de seguridad más alto que las salas compartidas por defecto:

• Ambas partes se enrutan a través de la red onion multi-salto de Tor — la dirección IP real ni la ubicación de ninguna de las partes es visible para nadie, incluyendo el servidor.
• No hay búsquedas DNS, ni CDN, ni infraestructura de terceros que toque la conexión en ningún punto.
• El análisis de tráfico es significativamente más difícil porque ambas partes se benefician del relleno de relés de Tor combinado con el relleno de conexión propio de nullchat (tramas ficticias aleatorias enviadas a intervalos aleatorios).
• No hay ningún participante de clearnet cuyos metadatos de conexión más débiles puedan correlacionarse con la conversación.

Solo eres tan anónimo como el eslabón más débil de la conversación. En una sala por defecto, la conexión de un participante de clearnet pasa por resolvedores DNS, infraestructura CDN y enrutamiento estándar de internet — todo lo cual puede ser observado o requerido judicialmente para obtener metadatos sobre quién se conectó, cuándo y desde dónde. El interruptor de solo Tor elimina este riesgo por completo al asegurar que cada participante tenga el mismo nivel de anonimato a nivel de red.

Ambas partes deben acordar activar el interruptor — funciona de la misma manera que acordar el secreto compartido. El encabezado del chat muestra "TOR ONLY" en verde cuando está activo, o "CLEARNET" en rojo para salas estándar, para que siempre sepas en qué modo estás.`,
  faq_18_title: "¿Qué es el tiempo de espera por inactividad?",
  faq_18_body: `Si estás inactivo durante 15 minutos — sin escribir, sin tocar, sin desplazarte — nullchat te desconectará automáticamente y te devolverá a la pantalla de entrada de contraseña. Una advertencia aparece a los 13 minutos dándote la opción de quedarte. Esto protege tu sesión si te alejas de tu dispositivo, evitando que los mensajes se destruyan mientras nadie los lee activamente, y asegurando que el chat no quede visible en una pantalla desatendida.`,
  faq_19_title: "¿Qué pasa con las direcciones IP?",
  faq_19_body: `En la clearnet (nullchat.org), la aplicación está alojada en la red perimetral de Cloudflare. Tu dirección IP se maneja a nivel de infraestructura y nunca es leída, registrada ni almacenada por el código de la aplicación. El código del servidor no accede a los encabezados de IP. No tenemos ningún mecanismo para identificarte por dirección de red.

En el servicio oculto de Tor (.onion), tu dirección IP nunca es visible para el servidor en absoluto — el enrutamiento onion de Tor garantiza anonimato completo a nivel de red. El servidor solo ve conexiones desde la red de Tor, sin forma de rastrearlas hasta ti.`,
  faq_20_title: "¿Hay cookies o rastreadores?",
  faq_20_body: `No. nullchat no establece cookies, no usa analíticas, no carga scripts de terceros, no incrusta píxeles de rastreo y no realiza solicitudes externas. Los encabezados de Content Security Policy lo aplican a nivel de navegador. Puedes verificarlo en las herramientas de desarrollo de tu navegador.`,
  faq_21_title: "¿Por qué no puedo enviar enlaces, imágenes o archivos?",
  faq_21_body: `Por diseño. nullchat es solo texto — no se pueden enviar ni renderizar enlaces, imágenes, archivos adjuntos ni medios de ningún tipo. Esta es una decisión de seguridad deliberada, no una limitación. Los enlaces clicables y los medios incrustados son la principal superficie de ataque para exploits de día cero utilizados por spyware comercial como Pegasus, Predator y herramientas de vigilancia similares. Un solo enlace o archivo malicioso puede comprometer silenciosamente un dispositivo completo. Al reducir el chat a solo texto plano, nullchat elimina este vector de ataque por completo. No hay nada que hacer clic, nada que descargar y nada que renderizar — lo que significa nada que explotar.`,
  faq_22_title: "¿Puedo copiar o capturar pantalla de los mensajes?",
  faq_22_body: `nullchat desalienta activamente la captura del contenido de los mensajes. La selección y copia de texto están deshabilitadas en el área del chat, los menús contextuales del clic derecho están bloqueados y los atajos de teclado comunes para capturas de pantalla son interceptados. La API de captura de pantalla del navegador también está bloqueada mediante encabezados Permissions-Policy, evitando que herramientas de grabación de pantalla basadas en web capturen la página.

Estas son protecciones basadas en fricción, no garantías absolutas. Un usuario determinado siempre puede fotografiar su pantalla con otro dispositivo o usar herramientas a nivel de sistema operativo que evaden las restricciones del navegador. El objetivo es dificultar la captura casual y reforzar la expectativa de que las conversaciones en nullchat no están destinadas a ser guardadas.`,
  faq_23_title: "¿Qué es el tráfico señuelo?",
  faq_23_body: `nullchat envía automáticamente mensajes ficticios cifrados a intervalos aleatorios (cada 10–60 segundos) mientras estás conectado a una sala. Estos mensajes señuelo son indistinguibles de los mensajes reales — tienen el mismo tamaño (gracias al relleno fijo), están cifrados con la misma clave y se retransmiten por la misma ruta del servidor. El cliente del destinatario los descarta silenciosamente después del descifrado.

El tráfico señuelo derrota el análisis de tráfico. Sin él, un observador que monitoree el tráfico de red podría determinar cuándo se produce comunicación real basándose en cuándo se envían los bloques cifrados. Con los señuelos, hay un flujo constante de tráfico de apariencia idéntica independientemente de si alguien está escribiendo realmente — haciendo imposible distinguir mensajes reales del ruido.`,
  faq_24_title: "¿Qué es el relleno de conexión?",
  faq_24_body: `El servidor envía tramas binarias de longitud aleatoria (64–512 bytes de datos aleatorios) a cada cliente conectado a intervalos aleatorios (cada 5–30 segundos). Estas tramas no son mensajes — son ruido puro que el cliente ignora silenciosamente. Combinado con el tráfico señuelo del lado del cliente, el relleno de conexión asegura que los patrones de tráfico de red no revelen nada sobre si se está produciendo comunicación real, cuántos mensajes se están intercambiando o cuándo los participantes están activos.`,
  faq_25_title: "¿Qué es la tecla de pánico?",
  faq_25_body: `Pulsar tres veces la tecla Escape borra instantáneamente tu sesión. Al activarse, nullchat envía un comando de terminación al servidor (eliminando todos tus mensajes), cierra la conexión WebSocket, pone a cero la clave de cifrado en memoria, limpia el DOM, borra sessionStorage y localStorage, limpia el portapapeles y redirige tu navegador a google.com. Todo el proceso toma menos de un segundo. Si el navegador intenta restaurar la página desde la caché (por ejemplo, mediante el botón atrás), la limpieza se reactiva automáticamente. Úsalo si necesitas borrar inmediatamente toda evidencia de la conversación de tu pantalla y navegador.`,
  faq_26_title: "¿Qué es el modo esteganográfico?",
  faq_26_body: `El modo esteganográfico disfraza la interfaz de nullchat como un editor de documentos. Pulsa Shift cinco veces rápidamente para activarlo. Toda la interfaz se transforma — la interfaz oscura del chat se reemplaza con una interfaz de edición de documentos de aspecto familiar con barra de herramientas y barra de menú. Los mensajes aparecen como párrafos en el cuerpo del documento, y tu entrada se integra como escritura activa. Todo el cifrado, los temporizadores de destrucción y las funciones de seguridad continúan operando normalmente por debajo.

Esto es útil si alguien está mirando por encima de tu hombro o si tu pantalla es visible para otros. A simple vista, parece que estás editando un documento, no teniendo una conversación cifrada. Pulsa Shift cinco veces de nuevo para volver a la vista normal del chat.`,
  faq_27_title: "¿nullchat limpia automáticamente el portapapeles?",
  faq_27_body: `Sí. Si se copia algo mientras estás en una sala de chat, nullchat limpia automáticamente tu portapapeles después de 15 segundos. El portapapeles también se borra cuando cierras la pestaña o navegas a otra página, e inmediatamente si usas la tecla de pánico. Esto evita que el contenido de los mensajes permanezca en tu portapapeles después de haber salido de la conversación.`,
  faq_28_title: "¿Pueden leer mis mensajes?",
  faq_28_body: `No. El servidor es un simple retransmisor. Recibe bloques cifrados y los reenvía. La clave de cifrado se deriva de tu secreto compartido, que nunca sale de tu navegador. No tenemos la clave. No podemos descifrar los bloques. Incluso si el servidor fuera comprometido, el atacante solo obtendría texto cifrado sin sentido.`,
  faq_29_title: "¿Pueden las agencias gubernamentales acceder a mis mensajes?",
  faq_29_body: `No podemos proporcionar lo que no tenemos. No hay mensajes en texto plano almacenados en ningún lugar. No hay cuentas de usuario que buscar. No hay registros de IP que entregar. Los bloques cifrados se eliminan automáticamente en un calendario fijo. Incluso bajo una orden legal válida, lo máximo que podríamos producir es una colección de bloques cifrados y hashes de salas — ninguno de los cuales es útil sin el secreto compartido que solo los participantes conocen.`,
  faq_30_title: "¿Es nullchat de código abierto?",
  faq_30_body_1: `Sí. Todo el código — cliente, servidor, cifrado y configuración de infraestructura — está disponible públicamente para auditoría en`,
  faq_30_body_2: `. Puedes verificar que el código que se ejecuta en el servidor coincide con lo publicado, compilarlo tú mismo o alojar tu propia instancia. La transparencia no es opcional para una herramienta que te pide que le confíes tus comunicaciones privadas.`,
  faq_31_title: "¿Quién construyó nullchat?",
  faq_31_body_1: `nullchat está construido por Artorias — una empresa de tecnología de inteligencia operada por veteranos con sede en la ciudad de Nueva York. Artorias existe para desmantelar sistemas obsoletos y equipar a las organizaciones e individuos más importantes con herramientas diseñadas específicamente para operar en la oscuridad. En su esencia, Artorias trata de democratizar la inteligencia y el anonimato — asegurando que la capacidad de comunicarse de forma segura y operar sin vigilancia no sea un privilegio reservado para unos pocos. nullchat es una expresión de esa misión: comunicación segura reducida a su esencia, sin compromisos en la integridad criptográfica. Más información en`,

};
