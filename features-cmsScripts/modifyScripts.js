module.exports = function modifyScriptData(controller) {
  if (controller.plugins.cms) {
    
    controller.on('message', async (bot,message)=>{
      console.log(message)
    })
}
};
