'use strict';

import * as login from './login';
import * as vscode from 'vscode';

import { URL } from 'url';
import validator from 'validator';
import { VaultSession } from '../model';

function validateURL(userInput: string): string | undefined {
    // If the input is a valid URL, return null (no error), otherwise return an error message
    return validator.isURL(userInput, { require_tld: false }) ? undefined : 'Not a valid URL';
}

export default async function(): Promise<VaultSession> {
    // Prompt for the Vault endpoint
    const endpoint = await vscode.window.showInputBox({ prompt: 'Enter the address of your vault server', validateInput: validateURL, value: process.env.VAULT_ADDR });
    // If no Vault endpoint was collected
    if (!endpoint) {
        return undefined;
    }

    // Create a URL object from the Vault endpoint
    const endpointUrl = new URL(endpoint);
    // Prompt for the friendly (display) name
    const name = await vscode.window.showInputBox({ prompt: 'Enter the friendly name of your vault', value: endpointUrl.host });
    // If no friendly (display) name was collected
    if (!name) {
        return undefined;
    }

    // Show the list of authentication options
    const selectedItem = await vscode.window.showQuickPick(login.AUTHENTICATION_ITEMS, { placeHolder: 'Select an authentication backend' });
    // If no authentication option was selected
    if (!selectedItem) {
        return undefined;
    }

    // Create a new Vault session object
    return new VaultSession(name, endpointUrl, selectedItem.callback);
}
