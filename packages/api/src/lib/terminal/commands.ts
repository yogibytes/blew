export type TerminalEntry = { kind: 'input' | 'output'; text: string }

export const commandHelp = `Commands:

init       New project
login      Authenticate
products   Manage products
logs       View logs
deploy      Deploy
clear      Clear
help       Show commands`

export const initialOutput = `A minimal SDK for crypto payments.

Commands:
init       New project
login      Authenticate
products   Manage products
logs       View logs
deploy      Deploy`

export function executeCommand(input: string): string {
  const command = input.trim().toLowerCase().split(/\s+/)[0] || ''
  switch (command) {
    case 'help': return commandHelp
    case 'init': return `Creating a new Blew project...\n\n✓ Project initialized\n✓ Payment configuration created\n\nNext:\nblew login`
    case 'login': return 'Opening authentication flow...'
    case 'products': return 'Fetching products...\n\nNo products found.'
    case 'logs': return 'Fetching transaction logs...\n\nNo transactions found.'
    case 'deploy': return 'Preparing deployment...\n\n✓ Build ready\n✓ Deployment queued\n\nPrototype response — no deployment was made.'
    case 'clear': return '__CLEAR__'
    case '': return ''
    default: return `Command not found: ${command}\nType “help” to see available commands.`
  }
}

export function formatInitialHistory(): TerminalEntry[] {
  return [{ kind: 'input', text: 'blew --help' }, { kind: 'output', text: initialOutput }]
}
