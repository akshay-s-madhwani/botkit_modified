describe('Botkit dialog', function () {

    it('should test qrpayload', async () => {

      let msg;
      const client = new BotkitTestClient('test', controller, ['qrpayload'], null, [receiveCustom]);

      msg = await client.sendActivity('qrpayload');
      assert(msg.type === 'typing', 'no typing');

    });


  });