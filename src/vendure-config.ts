import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import {
    createProxyHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    examplePaymentHandler,
    VendureConfig
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import path from 'path';
import { LandingPagePlugin } from './plugins/landing-page/landing-page-plugin';
import { DemoModePlugin } from './plugins/demo-mode/demo-mode-plugin';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        adminApiPlayground: {
            settings: {'request.credentials': 'include'},
        },
        adminApiDebug: true,
        shopApiPlayground: {
            settings: {'request.credentials': 'include'},
        },
        shopApiDebug: true,
        middleware: [{
            handler: createProxyHandler({
                label: 'Demo Storefront',
                port: 4000,
                route: 'storefrontx'
            }),
            route: 'storefrontx',
        }],
    },
    authOptions: {
        superadminCredentials: {
            identifier: <string>process.env.SUPERADMIN_IDENTIFIER,
            password: <string>process.env.SUPERADMIN_PASSWORD,
        },
    },
    dbConnectionOptions: {
        type: 'better-sqlite3',
        synchronize: false,
        logging: false,
        database: path.join(__dirname, '../vendure.sqlite'),
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    workerOptions: {
        runInMainProcess: true,
        options: { port: 3222 }
    },
    plugins: [
        DefaultJobQueuePlugin,
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            port: 3001,
            assetUrlPrefix: 'https://demo.vendure.io/assets/'
        }),
        EmailPlugin.init({
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                fromAddress: '"Vendure Demo Store" <noreply@vendure.io>',
                verifyEmailAddressUrl: 'https://demo.vendure.io/storefront/account/verify',
                passwordResetUrl: 'https://demo.vendure.io/storefront/account/reset-password',
                changeEmailAddressUrl: 'https://demo.vendure.io/storefront/account/change-email-address'
            },
            transport: {
                type: 'smtp',
                host: 'email-smtp.eu-central-1.amazonaws.com',
                port: 25,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: <string>process.env.SMTP_USER,
                  pass: <string>process.env.SMTP_PASSWORD
                }
            }
        }),
        DefaultSearchPlugin,
        AdminUiPlugin.init({
            port: 3002,
            adminUiConfig: {
                apiHost: 'auto',
                apiPort: 'auto',
            },
        }),
        LandingPagePlugin,
        DemoModePlugin,
    ],
};
