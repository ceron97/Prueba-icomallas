**Conocimientos tecnicos.**

1. **Conocimientos técnicos del frameworks (Vue.js)**

    1. ¿Qué es Vue.js y cómo se diferencia de otros frameworks de JavaScript?
        - Vue es un lenguaje con una curva de aprendizaje mas rapida y suave, tambien posee manipulacion de formal declarativa y reactiva en el DOM, sin necesidad de aplicar javascript, con un rendimiento mayor a otros frameworks.
    2. ¿Qué son las directivas en Vue.js? ¿Puedes dar algunos ejemplos?
        - Son los atributivo especiales que permiten la manipulacion del DOM de forma declarativa, estas formas son: v-if, v-for, :id="id".
    3. ¿Cómo se compara Vuex con Redux?
        - Vuex esta centrado para ser usado en vue y redux es una libreria javascript que se puede adaptar a dististos frameworks, Vuex esta mas optimizado y se diferencia principalmente en el contexto y la sintaxis, pero compartes la similitud de ser un store.
    4. ¿Qué es una instancia de Vue.js?
        - Es el foco que representa una aplicacion vue, esta es vinculada a elementos HTML a traves del DOM, gestionando y manipulando la vista con propiedades como data, methos, computed..., Los cuales definen el comportamiento de vue.
    5. ¿Qué es un ciclo de vida de un componente en Vue.js?
        - Es el proceso de construccion, montaje, actualizacion y destruccion del componente, esto es para mantener un control detallado sobre el comportamiento de los componentes
    6. ¿Cómo se puede comunicar un componente hijo con un componente padre en Vue.js?
        - Se puede comunicar usando la propiedad $emit en el hijo y referenciando con @eventoHijo, para escuchar el evento, adicionalmente se pueden usar props, entregadas por el padre.
    7. ¿Qué es una directiva personalizada en Vue.js?
        - Es el manejo de directivas las cuales se crean globalmente para permitir una logica conjunta, permitiendo la reutilizacion de procesos propios no pertenecientes a vue.
    8. ¿Qué es un mixin en Vue.js?
        - Es un objeto que tiene funcionalidades de componente, el cual puede ser reutilizado, combinandolo con componente de la aplicacion, combinandolos con estas
    9. ¿Qué es una transición en Vue.js?
        - Son etiquedas que se pueden aplicar a los elementos del DOM, al ser este modificado, creando, actualizando o eliminando, partes de este y que se vea con efectos visuales
    10. ¿Qué es una animación en Vue.js?
        - Es un evento de cambio visual, en la interfaz del usuario, el cual puede ser aplicado con la transicion de vue, css o javascript.

2. **Conocimientos técnicos del lenguaje de programación JavaScript.**

    1. ¿Qué es JavaScript y para qué se utiliza?
        - Es un lenguaje de programacion orientado a objetos, diseñado para ser usado en aplicativos web y adaptado para el desarrollo de servicios como lo son API, desarrollo movil, desarrollo de video juegos.
    2. ¿Cuál es la diferencia entre null y undefined?
        - Null es un estado en donde la propiedad es reconocida como vacia sin valor definido y undefined es un estado de elemento desconocido, en donde no se ha asignado ningun valor, pero se espera un valor.
    3. ¿Qué es el hoisting en JavaScript?
        - Es un concepto en donde se refiere a que las declaraciones y variables son movidas al inicio del codigo y por esta razon se pueden usar, aunque hayan sido declaradas despues del llamado, aunque estas se guardan en memoria y por esto se puede realizar de esta forma.
    4. ¿Qué es una función de callback y cómo se usa en JavaScript?
        - Es cuando una funcion, llamada a otra funcion la cual fue entregada por los parametros y es usada, cuando se cumple una condicion, llamandola igual que cualquier llamado "Function(callback) => (setTimeout(function() { callback()}))"
    5. ¿Qué es una promesa y cómo se manejan las promesas en JavaScript?
        - Son operaciones asincronicas las cuales, dan un resultado de exito o fracaso, con estados de pendiente y cumplida, se manejan declarando new Promise y usando resolve y reject o se puede usar al aplicar en una funcion los terminos then y catch
    6. ¿Qué es una clausura en JavaScript?
        - Son funciones que guardan estados de otras funciones exteriores aunque esta ya no este en el ambito de ejecucion mientras se mantenga el estado.
    7. ¿Qué es el this en JavaScript?
        - Hace referencia al objeto actual de ejecucion, en donde si se realiza dentro de un objeto hace referencia al objeto, si se usa en una funcion dentro de una clase, hace referencia a la funcion, se usa con el objeto mas cercado.
    8. ¿Qué es el prototype en JavaScript?
        - Es un mecanisco para la herencia en objetos, en el cual, si el objeto ya ha sido definido, el prototype, permite la integracion de estos, permitiendo la herencia en objetos
    9. ¿Qué es el event loop en JavaScript?
        - Es el mecanisco de tareas asincronicas, el cual se encarga de el manejo de tareas para una respuesta oportuna y rapida.
    10. ¿Qué es el spread operator en JavaScript?
        - Permite a los objetos itinerables ser expandidos, de esta forma combinandose o creando nuevos valores clave.
