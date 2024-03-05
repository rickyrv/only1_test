// -- TASK 1 -- //


addresses({
	staking_program_id: "5XDdQrpNCD89LtrXDBk5qy4v1BW1zRCPyizTahpxDTcZ",
	system_program_id: "11111111111111111111111111111111",
	locked_token_mint_id: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
});//pass


type Addresses = Record<string, string | { address: keyof Addresses} >

function addresses<T>(address: Addresses): void { //addresses takes in a single record whose type is Addresses.
  console.log("🚀 ~ address:", address)
}


// Test Task 1 // 
addresses({reward_token_mint_id:{address:"locked_token_mint_id"}})  // pass


// -- TASK 2 -- //

type Accounts = Array <{ id:string, signer?:true, address?: keyof Addresses} >;

type Instruction = Record<string , {accounts :Accounts} >;


interface Instructions{
  addresses: Addresses;
  instructions: Instruction;
}




function instructions(input: Instructions): Instruction {
  const { addresses, instructions } = input;

  function resolveAddress(address: keyof Addresses | string): string {
    if (typeof address === 'string') {
      const resolved = addresses[address];
      if (typeof resolved === 'string') {
        return resolved;
      } else if (resolved && typeof resolved === 'object') {
        return resolveAddress(resolved.address);
      }
    }
    return "Unable to resolve address";
  }

  for (const instructionKey in instructions) {
    const instruction = instructions[instructionKey];
    for (const accountKey in instruction.accounts) {
      const account = instruction.accounts[accountKey];
      if (account?.address) {
        account.address = resolveAddress(account.address);
      }
    }
  }
  console.log("🚀 ~ instructions ~ instructions:", instructions)
  return instructions;
}


// Test Task 2 //
instructions({
  addresses: {
    staking_program_id: "5XDdQrpNCD89LtrXDBk5qy4v1BW1zRCPyizTahpxDTcZ",
    locked_token_mint_id: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
    reward_token_mint_id: { address: "locked_token_mint_id" },
    system_program_id: "11111111111111111111111111111111",
  },
  instructions: {
    admin_init: {
      accounts: [
        { id: "admin_id", signer: true },
        { id: "program_id", address: "staking_program_id" },
        { id: "locked_token_mint_id", address: "locked_token_mint_id" },
        { id: "reward_token_mint_id", address: "reward_token_mint_id" },
        { id: "system_program_id", address: "system_program_id" },
      ],
    },
  }
});



// -- Task 3 -- //

function idReturn(accounts: Accounts): string[] {
  const ids: string[] = [];
  accounts.forEach((account) => {
    if (!account?.address) {
      ids.push(account.id);
    }
  }); 

  return ids;
}

type idReturnType = ReturnType<typeof idReturn>;


const results:idReturnType = 
idReturn([
  { id: "admin_id", signer: true },
  { id: "program_id", address: "staking_program_id" },
  { id: "locked_token_mint_id", address: "locked_token_mint_id" },
  { id: "reward_token_mint_id", address: "reward_token_mint_id" },
  { id: "system_program_id", address: "system_program_id" },
]);

console.log(results); // ["admin_id", "program_id", "locked_token_mint_id", "reward_token_mint_id", "system_program_id"]