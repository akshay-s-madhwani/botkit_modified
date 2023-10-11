let command = `hello`;
let thread = `default`;
const debug = require(`debug`);
/**
 * Iterate over an object recursively
 *
 * @param {*} obj object
 * @param {*} stack function
 * @returns property array
 */
exports.cmsScriptsIterate = function cmsScriptsIterate(obj = `init`, stack, prop) {
  // iterate recursively
  /*
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      const element = obj[property];
      if (typeof element === `object`) {
        exports.cmsScriptsIterate(element, `${stack}.${property}`, prop);
      } else {
        debug(`testing:cmsScriptsIterate`)(
          ` source object ${stack}.${property} = ${element}`
        );
        if (property === `command`) {
          command = element;
        }
        if (property === `topic`) {
          thread = element;
        }
        // console.log(
        //    `Counter : ${counter} , Command : ${command} , Topic : ${thread} , Prefix : ${prefix} , Stack : ${stack}`
        //  );
        prop[`${stack.trimLeft(`.`)}.${property}`] = {
          cmsi18thread: `${command}.${thread}`,
          cmsi18value: element,
        };
      }
    }
  }
*/
  /*
  Object.keys(obj).forEach(property => {
    const element = obj[property];
    if (element === null) {
      debug(`testing:cmsScriptsIterate`)(`element : `, element);
    } else if (typeof element === `object`) {
      exports.cmsScriptsIterate(element, `${stack}.${property}`, prop);
    } else {
      debug(`testing:cmsScriptsIterate`)(
        ` source object ${stack}.${property} = ${element}`
      );
      if (property === `command`) {
        command = element;
      }
      if (property === `topic`) {
        thread = element;
      }
      // console.log(
      //    `Counter : ${counter} , Command : ${command} , Topic : ${thread} , Prefix : ${prefix} , Stack : ${stack}`
      //  );
      prop[`${stack.trimLeft(`.`)}.${property}`] = {
        cmsi18thread: `${command}.${thread}`,
        cmsi18value: element,
      };
    }
  });
  */

  Object.entries(obj).forEach(([property, element]) => {
    // type of null is object so need to remove null for (typeof element === `object`) test
    console.debug(element)
    if (typeof element === `object`) {
      // null must be removed since it is an object
      if (element !== null) exports.cmsScriptsIterate(element, `${stack}.${property}`, prop);
    } else {
      debug(`testing:cms:iterate`)(`- src obj[property] ${stack}.${property} = ${obj[property]}`);

      if (property === `command`) {
        command = element;
      }
      if (property === `topic`) {
        thread = element;
      }
      // console.log(
      //    `Counter : ${counter} , Command : ${command} , Topic : ${thread} , Prefix : ${prefix} , Stack : ${stack}`
      //  );
      prop[`${stack.trimLeft(`.`)}.${property}`] = {
        cmsi18thread: `${command}.${thread}`,
        cmsi18value: element,
      };

      // remove replace split :defaultvalue from vars.str_ in {{vars ~}}
      if (element.toString().indexOf(`{{vars.str_`) !== -1) {
        // eslint-disable-next-line no-param-reassign
        obj[property] = element.replace(/{{(vars.str_.+?):.*?~}}/g, `{{$1}}`);
      }
      if (
        element.toString().indexOf(`Looks like you got distracted. We can continue later.`) !== -1
      ) {
        // eslint-disable-next-line no-param-reassign
        obj[
          property
        ] = `{{vars.str_distracted:en|Looks like you got distracted. We can continue later.§fr|Vous semblez être occupé, nous pourrions reprendre plus tard.§mg|Raha toa ka mbola sahirana ianao dia afaka tohizana aminy manaraka.~}`;
      }
      debug(`testing:cms:iterate`)(`= end obj[property] ${stack}.${property} = ${obj[property]}`);
    }
  });
};
