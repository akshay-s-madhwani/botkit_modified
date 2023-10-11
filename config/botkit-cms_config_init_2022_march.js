/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
// const { Cmshelper } = require("./bot-helpers");
const Cmshelper = require(`../bot-helpers/lib/cmshelper`);
const util = require(`util`);
// Import botkit-cms as local module including configuration override of botkit_mutagen.js
const localcms = require(`../func-override/botkit-cms_require`);
const _ = require(`lodash`);
const fse = require(`fs-extra`);
const prettier = require(`prettier`);
const { exit } = require("process");
const prettierOptions = {
  parser: `babel`,
  ...require(`../.prettierrc`),
};
const tmplbasedir = `${__dirname}/../templatefiles`;
const outfilebasedir = `${__dirname}/../features-dialogs`;

/**
 * Translate Key with Namespace, Language and optional DefaultValue
 *
 * @param {*} controller Botkit instance
 * @param {*} key i18next key to translate
 * @param {*} ns i18next namespace
 * @param {*} lng i18next language
 * @param {string} [defaultValue=undefined] -optional i18next defaultValue with [[ and ]] interpolation
 */
async function translateInterpolateDefault(controller, key, ns, lng, defaultValue = undefined) {
  const dir = `${controller.localizer.options.backend.addPath.split(`/{{`)[0]}/${lng}`;
  // const varnames = [];
  // With Promises:
  var res;
  await fse.ensureDir(dir)
    .then(async (error) => {
      controller.debug(`testing:cms:botkit-cms_config:translateInterpolateDefault`)(`fse.ensureDir result : ${dir} ${error}`);
      await controller.localizer.changeLanguage(lng).then(async () => {
        await controller.localizer.loadNamespaces([ns]).then(async () => {
          res = await controller.localizer.t(key, {
            ns,
            // fallbackLng: [`en`, `fr`],
            lng,
            // lngs: [`en`, `fr`],
            // fallbackLng: false,
            ...(defaultValue ? { defaultValue } : {}),
            // skipInterpolation: true,
            ...(defaultValue && defaultValue.indexOf(`[[`) !== -1
              ? {
                interpolation: { prefix: `[[`, suffix: `]]` },
                ...defaultValue.match(/\[\[.+?\]\]/g).reduce((map, obj) => {
                  // eslint-disable-next-line no-param-reassign
                  obj = obj.replace(`[[`, ``).replace(`]]`, ``);
                  // eslint-disable-next-line no-param-reassign
                  map[obj] = obj;
                  // varnames.push(map);
                  return map;
                }, {}),
              }
              : {}),
          });
          controller.debug(`testing:cms:botkit-cms_config:translateInterpolateDefault`)(`localizer.t result : ${res}`);
          return res;
        });
      });
    })
    .catch(err => {
      controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
        `- ERROR in fse.ensureDir(${dir}) : ${err}`
      );
    });
  const dummy = 'debug';

}

/**
 * Generate i18next translation file for each cmsi18n mustache vars thread-value pair
 *
 * @param {*} cmsi18Obj Object {cmsi18thread: "catalogue.default", cmsi18value: "{{vars.str_mustache_variable}}"}
 * @param {*} controller Botkit instance having i18next localizer cmsinit: option array
 */
async function loadMustacheVars2i18nextFiles(controller, cmsi18ObjArr) {
  await Promise.all(Object.values(cmsi18ObjArr).map(async (cmsi18Obj) => {
    //Object.values(cmsi18ObjArr).forEach(cmsi18Obj => {
    // const cmsObjItm = cmsObjArr[cmsPath];

    // controller.debug(`testing:cms:txt`)(`txt : `, cmsi18Obj);
    // loadMustacheVars2i18nextFiles(controller, cmsi18Obj);

    // const cmsi18valueStr = cmsi18Obj.cmsi18value.toString();
    let mustacheVars;
    if ((mustacheVars = cmsi18Obj.cmsi18value.toString().match(/{{vars\.str_.+?~}}/g)) !== null) {
      const ns = cmsi18Obj.cmsi18thread.split(controller.localizer.options.keySeparator)[0];
      // const thread = cmsi18Obj.cmsi18thread.split(controller.localizer.options.keySeparator)[1];
      controller.debug(`testing:cms:botkit-cms_config:loadMustacheVars2i18nextFiles`)(`mkey : `, mustacheVars);


      await Promise.all(mustacheVars.map(async (mustacheVar) => {
        //mustacheVars.forEach(mustacheVar => {
        const mustacheVarClean = mustacheVar.replace(`{{vars.`, ``).replace(`~}}`, ``);
        const varsStrKey = mustacheVarClean.split(`:`)[0];
        const cmsi18FullKey = `cms.${cmsi18Obj.cmsi18thread}.${varsStrKey}`;

        let p;
        if ((p = cmsi18Obj.cmsi18value.toString().match(/\[\[.+?\]\]/g)) !== null) {
          const tokens = Object.assign(
            ...[...new Set(p)].map(x => ({
              [`${x.replace(/[[\]]/g, ``)}`]: `tobedefinedbycode${x.replace(/[[\]]/g, ``)}`,
            }))
          );
          // const objtoken = tokens.reduce((obj, d) => Object.assign(obj, { [d[1]]: d[1] }), {});
          // if (!varnames[`${ns}.${thread}`]) varnames[`${ns}.${thread}`] = [];
          // { ...['a', 'b', 'c'] }
          _.set(controller.localcmsvars, cmsi18FullKey, tokens);
          // varnames[`${ns}.${thread}`].push([varsStrKey, tokens]);
        }

        // Init all values based on initial cms vars.str_ translation
        const rawdefs =
          mustacheVarClean.indexOf(`§`) !== -1
            ? mustacheVarClean.substring(mustacheVarClean.indexOf(`:`) + 1).split(`§`)
            : [mustacheVarClean.substring(mustacheVarClean.indexOf(`:`) + 1)];
        let allInitLang = JSON.parse(JSON.stringify(controller.localizer.options.cmsinit));

        var deflngtxt;

        await Promise.all(rawdefs.map(async (rawdef, index) => {
          if (rawdef) {
            //(async () => {
            //console.log('before 1st start');
            const lng =
              rawdef.indexOf(`|`) !== -1
                ? rawdef.split(`|`)[0]
                : controller.localizer.options.deflng;
            const defaultValue =
              rawdef.indexOf(`|`) !== -1 ? rawdef.split(`|`)[1] : `${rawdef}_${lng}`;
            if (lng == controller.localizer.options.deflng) {
              deflngtxt = defaultValue;
            }
            // Call start
            //(async() => {
            //  console.log('before start');

            await translateInterpolateDefault(controller, cmsi18FullKey, ns, lng, defaultValue);

            //  console.log('after start');
            //})();
            allInitLang = allInitLang.filter(value => value !== lng);
            // Init missing keys of initial langs
            if (index === rawdefs.length - 1) {
              //allInitLang.forEach(il => {
              //(async () => {
              //console.log('before 2nd start');

              await Promise.all(allInitLang.map(async (il) => {
                await translateInterpolateDefault(controller, cmsi18FullKey, ns, il, `${il}._${deflngtxt}`);
              }));


              //console.log('after 2nd start');
              //})();
              //});
            }
            //console.log('after 1st start');
            //})();
          }
        }));

        /*

        rawdefs.forEach(async (rawdef, index) => {
          if (rawdef) {
            //(async () => {
              //console.log('before 1st start');
              const lng =
                rawdef.indexOf(`|`) !== -1
                  ? rawdef.split(`|`)[0]
                  : controller.localizer.options.deflng;
              const defaultValue =
                rawdef.indexOf(`|`) !== -1 ? rawdef.split(`|`)[1] : `${rawdef}_${lng}`;
              if (lng == controller.localizer.options.deflng) {
                deflngtxt = defaultValue;
              }
              // Call start
              //(async() => {
              //  console.log('before start');

              await translateInterpolateDefault(controller, cmsi18FullKey, ns, lng, defaultValue);

              //  console.log('after start');
              //})();
              allInitLang = allInitLang.filter(value => value !== lng);
              // Init missing keys of initial langs
              if (index === rawdefs.length - 1) {
                allInitLang.forEach(il => {
                  //(async () => {
                    //console.log('before 2nd start');

                    await translateInterpolateDefault(controller, cmsi18FullKey, ns, il, `${il}._${deflngtxt}`);

                    //console.log('after 2nd start');
                  //})();
                });
              }
              //console.log('after 1st start');
            //})();
          }
        });

        */

        if (!_.has(controller.localcmsvars, cmsi18FullKey))
          _.set(controller.localcmsvars, cmsi18FullKey, {});

        controller.debug(`testing:cms:botkit-cms_config:loadMustacheVars2i18nextFiles`)(
          `loadMustacheVars2i18nextFiles : ${cmsi18FullKey}`
        );
        // controller.localcmsvars.push(mustache);
      }));

      controller.debug(`testing:cms:localcmsvars`)(
        `controller.localcmsvars : `,
        controller.localcmsvars
      );
    }
  }));
}

/**
 * Translate Facebook Generic Template to bot framework emulator format
 *
 * @param {*} jsonFbGeneric -
 * @returns json
 */
function generic2emulator(jsonFbGeneric) {
  // mapping of action button
  const buttonTypeMap = {
    web_url: { type: `openUrl`, value: `url` }, // URL to be opened in the built-in browser
    // imBack	// Text of the message to send to the bot (from the user who clicked the button or tapped the card). This message (from user to bot) will be visible to all conversation participants via the client application that is hosting the conversation.
    postback: { type: `postBack`, value: `payload` }, // Text of the message to send to the bot (from the user who clicked the button or tapped the card). Some client applications may display this text in the message feed, where it will be visible to all conversation participants.
    phone_number: { type: `call`, value: `payload` }, // Destination for a phone call in this format: tel:123123123123
    account_unlink: { type: `signin`, value: `url` },
    game_play: { type: `playVideo`, value: `payload` }, // URL of video to be played
    account_link: { type: `signin`, value: `url` },
    element_share: { type: `openUrl`, value: `url` },
  };

  const output = jsonFbGeneric.elements.map(card => ({
    contentType: `application/vnd.microsoft.card.hero`,
    content: {
      title: card.title,
      subtitle: card.subtitle,
      text: card.subtitle,
      images: [
        {
          url: card.image_url || `white2.jpg`,
        },
      ],
      buttons: card.buttons.map(button => ({
        title: button.title,
        type: buttonTypeMap[button.type].type,
        value: button[buttonTypeMap[button.type].value],
      })),
    },
  }));

  return output;
}

/**
 * Generate source code of all "after" in all dialog thread
 *
 * @param {*} script string
 * @param {*} thread string
 * @param {*} [cmstokens=[]] array
 */
function genAfterCode(script) {
  // const outFilenameBefore = `${outfilebasedir}/before_${script}_${thread}.js`;
  const outFilenameAfter = `${outfilebasedir}/gen_${script}_after.js`;
  // const templateBeforeCode = fse.readFileSync(`${tmplbasedir}/template_before.js`, `utf8`);
  const templateAfterCode = fse.readFileSync(`${tmplbasedir}/template_after.js`, `utf8`);
  // const fileBeforeExists = fse.existsSync(outFilenameBefore);
  const fileAfterExists = fse.existsSync(outFilenameAfter);

  /* let outBeforeCode = templateBeforeCode.replace(
    /replaceFuncName/g,
    _.camelCase(`before${script}${thread}`)
  );
  outBeforeCode = outBeforeCode.replace(/replaceScript/g, `${script}`);
  outBeforeCode = outBeforeCode.replace(/replaceThread/g, `${thread}`);
*/
  let outAfterCode = templateAfterCode.replace(/replaceFuncName/g, _.camelCase(`after${script}`));
  outAfterCode = outAfterCode.replace(/replaceScript/g, `${script}`);
  // outAfterCode = outAfterCode.replace(/replaceThread/g, `${thread}`);

  /*
  if (cmstokens.length) {
    outBeforeCode = outBeforeCode.replace(
      `let cmstokens;`,
      prettier
        .format(`const cmstokens = ${JSON.stringify(cmstokens)};`, prettierOptions)
        .replace(/"/g, `\``)
    );
  } else {
    outBeforeCode = outBeforeCode.replace(`let cmstokens;`, `const cmstokens = [];`);
  }

  // const outBeforeCodeFormatted = prettier.format(outBeforeCode, prettierOptions);
  if (!fileBeforeExists) {
    fse.outputFileSync(outFilenameBefore, prettier.format(outBeforeCode, prettierOptions));
  } else {
    const existFilenameContent = fse.readFileSync(outFilenameBefore, `utf8`);
    const requireRegex = /REQUIRE DEFINITION START.*\/\/ REQUIRE VALUES DEFINITION END/s;
    const custCodeRegex = /CUSTOM CODES\/ACTIONS START.*\/\/ CUSTOM CODES\/ACTIONS END/s;
    const tokensRegex = /CMSTOKENS VALUES DEFINITION START.*\/\/ CMSTOKENS VALUES DEFINITION END/s;
    const existRequireContent = existFilenameContent.match(requireRegex)[0];
    const existCustCodeContent = existFilenameContent.match(custCodeRegex)[0];
    const existTokensContent = existFilenameContent.match(tokensRegex)[0];
    outBeforeCode = outBeforeCode.replace(requireRegex, existRequireContent);
    outBeforeCode = outBeforeCode.replace(custCodeRegex, existCustCodeContent);
    outBeforeCode = outBeforeCode.replace(tokensRegex, existTokensContent);
    fse.outputFileSync(outFilenameBefore, outBeforeCode);
  }
*/
  if (!fileAfterExists) {
    fse.outputFileSync(outFilenameAfter, prettier.format(outAfterCode, prettierOptions));
  } else {
    const existFilenameContent = fse.readFileSync(outFilenameAfter, `utf8`);
    const requireRegex = /REQUIRE DEFINITION START.*\/\/ REQUIRE VALUES DEFINITION END/s;
    const custCodeRegex = /CUSTOM CODES\/ACTIONS START.*\/\/ CUSTOM CODES\/ACTIONS END/s;
    if (existFilenameContent.match(requireRegex)) {
      const existRequireContent = existFilenameContent.match(requireRegex)[0];
      outAfterCode = outAfterCode.replace(requireRegex, `#${existRequireContent}`);
    }
    if (existFilenameContent.match(custCodeRegex)) {
      const existCustCodeContent = existFilenameContent.match(custCodeRegex)[0];
      outAfterCode = outAfterCode.replace(custCodeRegex, `#${existCustCodeContent}`);
    }
    fse.outputFileSync(outFilenameAfter, prettier.format(outAfterCode, prettierOptions));
  }
}

/**
 * Generate source code of all "before" in all dialog thread
 *
 * @param {*} script string
 * @param {*} thread string
 * @param {*} [cmstokens=[]] array
 */
function genBeforeCode(script, thread, cmstokens = []) {
  const outFilenameBefore = `${outfilebasedir}/gen_${script}_before_${thread}.js`;
  // const outFilenameAfter = `${outfilebasedir}/after_${script}.js`;
  const templateBeforeCode = fse.readFileSync(`${tmplbasedir}/template_before.js`, `utf8`);
  // const templateAfterCode = fse.readFileSync(`${tmplbasedir}/template_after.js`, `utf8`);
  const fileBeforeExists = fse.existsSync(outFilenameBefore);
  // const fileAfterExists = fse.existsSync(outFilenameAfter);

  let outBeforeCode = templateBeforeCode.replace(
    /replaceFuncName/g,
    _.camelCase(`before${script}${thread}`)
  );
  outBeforeCode = outBeforeCode.replace(/replaceScript/g, `${script}`);
  outBeforeCode = outBeforeCode.replace(/replaceThread/g, `${thread}`);

  /*
  let outAfterCode = templateAfterCode.replace(/replaceFuncName/g, _.camelCase(`after${script}`));
  outAfterCode = outAfterCode.replace(/replaceScript/g, `${script}`);
  outAfterCode = outAfterCode.replace(/replaceThread/g, `${thread}`);
*/

  if (cmstokens.length) {
    outBeforeCode = outBeforeCode.replace(
      `let cmstokens;`,
      prettier
        .format(`const cmstokens = ${JSON.stringify(cmstokens)};`, prettierOptions)
        .replace(/"/g, `\``)
    );
  } else {
    outBeforeCode = outBeforeCode.replace(`let cmstokens;`, `const cmstokens = [];`);
  }

  // const outBeforeCodeFormatted = prettier.format(outBeforeCode, prettierOptions);
  if (!fileBeforeExists) {
    fse.outputFileSync(outFilenameBefore, prettier.format(outBeforeCode, prettierOptions));
  } else {
    const existFilenameContent = fse.readFileSync(outFilenameBefore, `utf8`);
    const requireRegex = /REQUIRE DEFINITION START.*\/\/ REQUIRE VALUES DEFINITION END/s;
    const tokensRegex = /CMSTOKENS VALUES DEFINITION START.*\/\/ CMSTOKENS VALUES DEFINITION END/s;
    const custCodeRegex = /CUSTOM CODES\/ACTIONS START.*\/\/ CUSTOM CODES\/ACTIONS END/s;
    if (existFilenameContent.match(requireRegex)) {
      const existRequireContent = existFilenameContent.match(requireRegex)[0];
      outBeforeCode = outBeforeCode.replace(requireRegex, `#${existRequireContent}`);
    }
    if (existFilenameContent.match(tokensRegex)) {
      const existTokensContent = existFilenameContent.match(tokensRegex)[0];
      outBeforeCode = outBeforeCode.replace(tokensRegex, `#${existTokensContent}`);
    }
    if (existFilenameContent.match(custCodeRegex)) {
      const existCustCodeContent = existFilenameContent.match(custCodeRegex)[0];
      outBeforeCode = outBeforeCode.replace(custCodeRegex, `#${existCustCodeContent}`);
    }
    fse.outputFileSync(outFilenameBefore, prettier.format(outBeforeCode, prettierOptions));
  }

  /*
  if (!fileAfterExists) {
    fse.outputFileSync(outFilenameAfter, outAfterCode);
  } else {
    const existFilenameContent = fse.readFileSync(outFilenameAfter, `utf8`);
    const requireRegex = /REQUIRE DEFINITION START.*\/\/ REQUIRE VALUES DEFINITION END/s;
    const custCodeRegex = /CUSTOM CODES\/ACTIONS START.*\/\/ CUSTOM CODES\/ACTIONS END/s;
    const existRequireContent = existFilenameContent.match(requireRegex)[0];
    const existCustCodeContent = existFilenameContent.match(custCodeRegex)[0];
    outAfterCode = outAfterCode.replace(requireRegex, existRequireContent);
    outAfterCode = outAfterCode.replace(custCodeRegex, existCustCodeContent);
    fse.outputFileSync(outFilenameAfter, outAfterCode);
  }
  */
}

/**
 * Generate source code of all "onchange" in all dialog thread
 *
 * @param {*} script string
 * @param {*} thread string
 * @param {*} vararr string
 */
function genOnChangeCode(script, thread, vararr) {
  const templateOnChangeCode = fse.readFileSync(`${tmplbasedir}/template_onchange.js`, `utf8`);

  vararr.forEach(varval => {
    const outFilename = `${outfilebasedir}/gen_${script}_onchange_${thread}_${varval}.js`;
    let varvalOnChangeCode;

    varvalOnChangeCode = templateOnChangeCode.replace(
      /replaceFuncName/g,
      _.camelCase(`onchange${script}${varval}`)
    );
    varvalOnChangeCode = varvalOnChangeCode.replace(/replaceScript/g, `${script}`);
    varvalOnChangeCode = varvalOnChangeCode.replace(/replaceThread/g, `${thread}`);
    varvalOnChangeCode = varvalOnChangeCode.replace(/replaceVariable/g, `${varval}`);

    if (!fse.existsSync(outFilename)) {
      fse.outputFileSync(outFilename, prettier.format(varvalOnChangeCode, prettierOptions));
    } else {
      const existFilenameContent = fse.readFileSync(outFilename, `utf8`);
      const requireRegex = /REQUIRE DEFINITION START.*\/\/ REQUIRE VALUES DEFINITION END/s;
      const custCodeRegex = /CUSTOM CODES\/ACTIONS START.*\/\/ CUSTOM CODES\/ACTIONS END/s;
      if (existFilenameContent.match(requireRegex)) {
        const existRequireContent = existFilenameContent.match(requireRegex)[0];
        varvalOnChangeCode = varvalOnChangeCode.replace(requireRegex, `#${existRequireContent}`);
      }
      if (existFilenameContent.match(custCodeRegex)) {
        const existCustCodeContent = existFilenameContent.match(custCodeRegex)[0];
        varvalOnChangeCode = varvalOnChangeCode.replace(custCodeRegex, `#${existCustCodeContent}`);
      }
      fse.outputFileSync(outFilename, prettier.format(varvalOnChangeCode, prettierOptions));
    }
  });
}

/**
 * Initialize CMS input scripts to handle extra functionality
 * -typing
 * -multilang
 * -parameterized message
 * -...
 *
 * @param {*} controller
 * @param {*} results
 * @param {*} bfOnAftCodeGenlists
 * @returns
 */
async function initCmsDialogCustom(controller, results, bfOnAftCodeGenlists) {
  controller.debug(`testing:cms:inspect`)(
    `loadScriptsFromFile(scriptFile) inspect : `,
    util.inspect(results, false, null, true /* enable colors */)
  );
  const cmshelper = new Cmshelper();
  // cmsi18ObjArr = Array(0) [, …] of 1.script.0.script.1.text.0: Object {cmsi18thread: "catalogue.default", cmsi18value: "{{vars.str_mustache_variable}}"}
  // do all dialog transformation before loading
  const cmsi18ObjArr = cmshelper.m2i18n(results);
  // loop through each cmsPath (1.script.0.script.1.text.0)
  const interrupts = [];
  results.forEach((script, a, oaArr) => {
    cmsi18ObjArr.push({
      cmsi18thread: `${script.command}`,
      cmsi18value: `{{vars.str_afterscriptdone:fr| vient de finir, voici les résultats : §mg| dia vita! ireto ny valiny : §en| just ended! here are the results : ~}}`,
    });
    // generate interruption loader file from template
    if (script.command.indexOf(`interrupt`) !== -1) {
      const intForJson = {
        patterns: script.triggers.map(trigger =>
          trigger.type === `regexp` ? `new RegExp(/${trigger.pattern}/i)` : `${trigger.pattern}`
        ),
        events: [`message`, `direct_message`],
        dialog: script.command,
      };
      interrupts.push(intForJson);
      // `../templatefiles/template_interrupts.js``../features-interrupts/interrupts_loader.js``const trigger2dialogs = [];`;
      controller.debug(`interruptload`)(`interruptload pause : `);
    }
    // map threads from array to object
    oaArr[a].script.forEach((thread, b, obArr) => {
      // let varx = script.variables.map(x => x.name);

      for (var c = obArr[b].script.length - 1; c >= 0; c--) {
        const ocArr = obArr[b].script;
        const convItem = obArr[b].script[c];
      }

      for (var c = obArr[b].script.length - 1; c >= 0; c--) {
        const ocArr = obArr[b].script;
        const convItem = obArr[b].script[c];
        // implement cms dynamic quick_reply
        if (convItem.quick_replies && convItem.quick_replies[0].title.indexOf(`dynfunc_`) !== -1) {
          const reqfile = `${__dirname}/../dynfunction/${script.command}_script.js`;
          const reqfunc = `${convItem.quick_replies[0].title.split(`_`)[2]}`;
          const reqfuncFb = _.camelCase(`thread_${thread.topic}_${reqfunc}Fb`);
          // const origAttachmentsStr = JSON.stringify(generic2emulator(convItem.fb_attachment));
          const origAttachmentsStrFb = JSON.stringify(convItem.quick_replies).replace(
            /dynfunc_/g,
            `from ${script.command}.js dynfunc_`
          );
          fse.ensureFileSync(`${reqfile}`);
          // generate function file for quick_replies
          if (
            !(
              fse
                .readFileSync(`${reqfile}`)
                .toString()
                .indexOf(`function ${reqfuncFb}`) !== -1
            )
          ) {
            const newfuncFb = `
                exports.${reqfuncFb} = function ${reqfuncFb}(template, vars, ocArr, c, controller) {
                  return ${origAttachmentsStrFb};
                };
                `;
            fse.appendFileSync(reqfile, newfuncFb);
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachmentsFb;
            // eslint-disable-next-line no-param-reassign
            ocArr[c].quick_replies = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return require(reqfile)[reqfuncFb](template, vars, ocArr, c, controller);
            };
          } else {
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachmentsFb;
            // eslint-disable-next-line no-param-reassign
            ocArr[c].quick_replies = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return require(reqfile)[reqfuncFb](template, vars, ocArr, c, controller);
            };
          }
          controller.debug(`testing:cms:dynamicqr`)(`dynamicqr pause : `);
        }
        // generate emulator format from fb attachment
        if (convItem.fb_attachment && typeof convItem.fb_attachment !== `function`) {
          controller.debug(`testing:cms:generic2emulator`)(`generic2emulator pause : `);
          if (
            convItem.fb_attachment.template_type &&
            convItem.fb_attachment.template_type === `generic`
          ) {
            ocArr[c].attachmentLayout = `carousel`;
          }
          ocArr[c].attachments = generic2emulator(convItem.fb_attachment);
        }
        // implement dynamic functionality for generic_template
        if (
          convItem.fb_attachment &&
          convItem.fb_attachment.elements[0].title.indexOf(`dynfunc_`) !== -1
        ) {
          const reqfile = `${__dirname}/../dynfunction/${script.command}_script.js`;
          const reqfunc = `${convItem.fb_attachment.elements[0].title.split(`_`)[2]}`;
          const reqfuncFb = _.camelCase(`thread_${thread.topic}_${reqfunc}Fb`);
          // const origAttachmentsStr = JSON.stringify(generic2emulator(convItem.fb_attachment));
          const origAttachmentsStrFb = JSON.stringify(convItem.fb_attachment).replace(
            /dynfunc_/g,
            `from ${script.command}.js dynfunc_`
          );
          if (
            convItem.fb_attachment.template_type &&
            convItem.fb_attachment.template_type === `generic`
          ) {
            ocArr[c].attachmentLayout = `carousel`;
          }
          /*
          const setDynAttachments = (ocArr[c].attachments = async (template, vars) => {
            // dynfunc_langunknowndialogdefault_qrnewlang
            // eslint-disable-next-line import/no-dynamic-require
            return require(`${reqfile}`)[`${reqfunc}`](template, vars, ocArr, c, controller);
          });
          */
          /*
          const setDynAttachmentsFb = (ocArr[c].fb_attachment = async (template, vars) => {
            // dynfunc_langunknowndialogdefault_qrnewlang
            // eslint-disable-next-line import/no-dynamic-require
            return require(`${reqfile}`)[`${reqfuncFb}`](template, vars, ocArr, c, controller);
          });
          */
          fse.ensureFileSync(`${reqfile}`);
          // generate function file for fb_attachments
          if (
            !(
              fse
                .readFileSync(`${reqfile}`)
                .toString()
                .indexOf(`function ${reqfuncFb}`) !== -1
            )
          ) {
            const newfuncFb = `
                exports.${reqfuncFb} = function ${reqfuncFb}(template, vars, ocArr, c, controller) {
                  return ${origAttachmentsStrFb};
                };
                `;
            fse.appendFileSync(reqfile, newfuncFb);
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachmentsFb;
            ocArr[c].fb_attachment = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return require(`${reqfile}`)[`${reqfuncFb}`](template, vars, ocArr, c, controller);
            };
            ocArr[c].attachments = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return generic2emulator(
                // eslint-disable-next-line import/no-dynamic-require
                require(`${reqfile}`)[`${reqfuncFb}`](template, vars, ocArr, c, controller)
              );
            };
          } else {
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachmentsFb;
            ocArr[c].fb_attachment = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return require(`${reqfile}`)[`${reqfuncFb}`](template, vars, ocArr, c, controller);
            };
            ocArr[c].attachments = async (template, vars) => {
              // dynfunc_langunknowndialogdefault_qrnewlang
              // eslint-disable-next-line import/no-dynamic-require
              return generic2emulator(
                // eslint-disable-next-line import/no-dynamic-require
                require(`${reqfile}`)[`${reqfuncFb}`](template, vars, ocArr, c, controller)
              );
            };
          }
          /*
          // generate function file for botbuilder native attachment
          if (
            !(
              fse
                .readFileSync(`${reqfile}`)
                .toString()
                .indexOf(`function ${reqfunc}`) !== -1
            )
          ) {
            const newfunc = `
            exports.${reqfunc} = function ${reqfunc}(template, vars, ocArr, c, controller) {
              return ${origAttachmentsStr};
            };
            `;
            fse.appendFileSync(reqfile, newfunc);
 
            // ocArr[c].attachmentLayout = `carousel`;
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachments;
          } else {
            // ocArr[c].attachmentLayout = `carousel`;
            // eslint-disable-next-line no-unused-expressions
            // setDynAttachments;
          }
          */
          controller.debug(`testing:cms:dynamiccarousel`)(`dynamiccarousel pause : `);
        }
        // implement cms typing
        if (convItem.text) {
          if (convItem.text[0].indexOf(`typing_`) !== -1) {
            const delayVal = convItem.text[0].match(/typing_(\d+)/)[1];
            // eslint-disable-next-line no-param-reassign
            // ocArr[c].text[0] = { type: `typing` }, { type: `delay`, value: delayVal }];
            ocArr.splice(c, 1, ...[{ type: `typing` }, { type: `delay`, value: delayVal }]);
            controller.debug(`testing:cms:typing`)(`typing pause : `);
          } else {
            const longest = convItem.text.reduce(
              function (a, b) {
                return a.length > b.length ? a : b;
              }
            );
            if (longest != '') {
              ocArr.splice(c, 0, ...[{ type: `typing` }, { type: `delay`, value: (process.env.TYPINGCOST || 1) * longest.length }]);
              controller.debug(`testing:cms:typing`)(`typing delay : `);
            }
          }
        }
      };
      bfOnAftCodeGenlists[`${script.command}.${thread.topic}`] = thread.script
        .filter(x => x.collect && x.collect.key)
        .map(x => {
          cmsi18ObjArr.push({
            cmsi18thread: `${script.command}.${thread.topic}`,
            cmsi18value: `{{vars.str_valuegotset:en|Value [[value]] of [[valname]] well received§fr|Valeur [[value]] de [[valname]] bien reçu§mg|Voaray ny [[valname]] mitentina [[value]]~}}`,
          });
          return x.collect.key;
        });
    });
  });
  // generate interrupts_loader file
  const templateInterrupt = fse.readFileSync(
    `${__dirname}/../templatefiles/template_interrupts.js`,
    `utf8`
  );
  fse.outputFileSync(
    `${__dirname}/../features-interrupts/gen_interrupts_loader.js`,
    prettier
      .format(
        templateInterrupt.replace(
          `const trigger2dialogs = [];`,
          `const trigger2dialogs = ${JSON.stringify(interrupts)
            .replace(/\/i\)"/g, `/i)`)
            .replace(/\\\\/g, `\\`)
            .replace(/"new RegExp/g, `new RegExp`)};`
          // .replace(/"/g, `\``)};`
        ),
        prettierOptions
      )
      .replace(/"/g, `\``)
  );
  controller.debug(`testing:cms:txt`)(`txt : `, cmsi18ObjArr);

  /** loadMustacheVars2i18nextFiles is critical for translation loading into dialogs */
  await loadMustacheVars2i18nextFiles(controller, cmsi18ObjArr);

  // ______________________________________________________
  /**
   *   At this point all object to generate before onChange and after codes are populated
   *   bfOnAftCodeGenlists contains all script and thread for before and after + onchange value
   *
   *   controller.localcmstokens contains all tokens like below sample
   *```javascript
   * const cmstokens = [
   * [`str_getting_started`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
   * [`str_mustache_variable`, { es6var: `${es6var}` }],
   * ];
   * ```
   */
  // ______________________________________________________
  if (process.env.USERNAME === '1301921' || (!process.env.DYNO && process.env.NODE_ENV !== `production`)) {
    const afterFlag = [];
    Object.entries(bfOnAftCodeGenlists).forEach(keyval => {
      const script = keyval[0].split(`.`)[0];
      const thread = keyval[0].split(`.`)[1];
      // const fuck = Object.entries(controller.localcmsvars.cms[`${script}`][`${thread}`]);
      const cmstokens = _.has(controller.localcmsvars.cms, `${script}.${thread}`)
        ? Object.entries(controller.localcmsvars.cms[`${script}`][`${thread}`])
        : [];
    //  if (!process.env.DYNO && process.env.NODE_ENV !== `production`) {
        genBeforeCode(script, thread, cmstokens);
        if (!afterFlag.includes(script)) {
          genAfterCode(script);
          afterFlag.push(script);
        }
        if (keyval[1].length) {
          genOnChangeCode(script, thread, keyval[1]);
        }
    //  }
    });
    controller.debug(`testing:cms:befOnchAftlists`)(`befOnchAftlists : `, bfOnAftCodeGenlists);
  }
  controller.debug(`debug pause`)(`empty debug pause`);
}

module.exports = async function botkitCmsConfigInit(controller) {
  controller.localcmsvars = {};
  controller.localcmstokens = {};
  // controller.codeGenTokens = {};
  const bfOnAftCodeGenlists = {};
  // loadScriptsFromFile

  /*
  controller.plugins.cms
    .loadAllScripts(controller)
    .then(results => {
      controller.debug(`testing:cms:inspect`)(
        `Dialogs custom loaded from Botkit CMS loadAllScripts(controller) inspect : `,
        util.inspect(results, false, null, true) //* enable colors *)
      );
      // controller.debug(`testing:cms:loading`)(`Dialogs custom loaded from Botkit CMS`);
      // this._controller.completeDep('cms');
    })
    .catch(err => {
      controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
        `- ERROR in localcms.loadAllScripts(controller) : ${err}`
      );
    });
    */

  const scriptFile = `${__dirname}/../cms-scripts/scripts.json`;
  localcms.useLocalStudio(controller);
  await localcms
    .loadScriptsFromFile(scriptFile)
    .then(async (results) => {
      controller.debug(`testing:cms:inspect`)(
        `Dialogs custom loaded from loadScriptsFromFile(scriptFile) inspect : `,
        util.inspect(results, false, null, true) //* enable colors *)
      );
      await initCmsDialogCustom(controller, results, bfOnAftCodeGenlists);
      // controller.localizer.tid = translateInterpolateDefault;
    })
    .catch(err => {
      controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
        `- ERROR in localcms.loadScriptsFromFile(${scriptFile}) : ${err}`
      );
      exit();
    });

  /*   localcms
    .getScripts()
    .then(results => {
      controller.debug(`testing:cms:inspect`)(
        `getScripts() inspect : `,
        util.inspect(results, false, null, true /* enable colors */ // )
  /*  );
    })
    .catch(err => {
      controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
        `- ERROR in localcms.getScripts() : ${err}`
      );
    });
 */
};
