---
title: Single sign-on (SSO)
description: Sign in to the infinidysk 2.x UI through an OpenID Connect provider such as Authentik, Authelia or Keycloak.
---

infinidysk can sign you in to the UI through one OpenID Connect (OIDC) provider, such as Authentik, Authelia or Keycloak. SSO only covers the UI. WebDAV, the SABnzbd API and the admin API keep their own logins and keys.

:::caution[Every SSO user is an admin]
2.x has no read-only role. Anyone your identity provider lets sign in to this client can change every setting. Limit who may use the client at the identity provider, for example with a group policy.
:::

## Set up SSO

1. Register infinidysk at your identity provider as a confidential client that uses the authorization code flow. Steps for common providers are [below](#identity-provider-setup).
2. Register this redirect URI at the provider, with your own host name:

   ```
   https://infinidysk.example.com/auth/oidc/callback
   ```

3. In infinidysk, open Settings > System > Access > **Single sign-on** and fill in:

   | Field | What to enter |
   |-------|---------------|
   | Issuer URL | The issuer exactly as the provider publishes it, trailing slash included. Leave empty to turn SSO off. |
   | Client ID | From the provider. |
   | Client secret | From the provider. It is masked in the UI, the API and support bundles. |
   | Redirect URI | Leave empty to use the [Public URL](/v2/operate/reverse-proxy/#public-url) plus `/auth/oidc/callback`. Set it when the provider needs a different address. |
   | Scopes | Default `openid profile email`. `openid` is always sent. |
   | Username claim | The ID-token claim shown as your username. Default `preferred_username`. If it is missing, infinidysk tries `preferred_username`, `email`, then `sub`. |

4. Save, sign out, and use **Sign in with SSO** on the sign-in page.

Issuer, token and key addresses must use `https://`. `http://` is accepted only for an identity provider on the same machine (`localhost` or a loopback address). infinidysk does not follow redirects from the identity provider.

### Redirect URI behind a reverse proxy

With no Redirect URI and no Public URL, infinidysk builds the redirect URI from the address the request came to. It trusts `X-Forwarded-Host` and `X-Forwarded-Proto` only from [trusted proxies](/v2/operate/reverse-proxy/#trusted-proxies). Behind a proxy that ends TLS, set the Public URL or list the proxy under trusted proxies. Otherwise the redirect URI may start with `http://` and the provider will reject it.

The redirect URI must match the one registered at the provider exactly: scheme, host, port and path. If you open the UI on another address, such as `http://192.168.1.10:3000`, SSO first sends you to the redirect URI's host and signs you in there.

## Password sign-in

With an admin account, the password form stays on the sign-in page under **Sign in with SSO**. To allow only SSO, turn **Password sign-in** off in the same panel.

- The switch shows only when an admin account exists.
- It stays on while SSO is off, and when you set SSO up for the first time.
- You can turn it off only after one SSO sign-in has worked with the saved settings. This keeps a wrong setting from locking you out.

Without an admin account, for example after an upgrade from 1.x that used SSO only, SSO is the only way to sign in and setup does not offer to create an account.

## Sessions

A sign-in lasts 30 days. Signing out ends the infinidysk session only, not the session at your identity provider, so **Sign in with SSO** may sign you straight back in.

Changing the issuer or client ID signs out every SSO session. Changing other SSO settings keeps sessions, but **Password sign-in** cannot be turned off until an SSO sign-in works again with the new settings.

## Locked out

If the identity provider is down or the settings are wrong:

- **With an admin account:** set `INFINIDYSK__AUTH__LOCAL_LOGIN=true` and restart. Sign in with your password, fix SSO, then remove the variable.
- **Without an admin account:** set `INFINIDYSK__AUTH__MODE=local` and restart. Open infinidysk from your local network, where sign-in is skipped, fix SSO, then remove the variable.

Clearing `INFINIDYSK__AUTH__OIDC__ISSUER` also turns SSO off. On an install without an admin account this lets the next visitor create one, so prefer the steps above.

## Settings as environment variables

Each field can be forced with an environment variable, for example to keep the client secret out of the database:

```yaml
environment:
  INFINIDYSK__AUTH__OIDC__ISSUER: https://auth.example.com/application/o/infinidysk/
  INFINIDYSK__AUTH__OIDC__CLIENT_ID: infinidysk
  INFINIDYSK__AUTH__OIDC__CLIENT_SECRET: replace-with-your-client-secret
```

[Environment variables](/v2/reference/environment/#sign-in-auth) lists all of them.

## Identity provider setup

### Authentik

1. Create an OAuth2/OpenID Provider and an application linked to it.
2. Use a confidential client.
3. Add the redirect URI as a strict redirect URI.
4. Include the `openid`, `profile` and `email` scopes.
5. Bind a group or policy to the application so only admins can use it.
6. Use the provider's **OpenID Configuration Issuer** as the Issuer URL, for example `https://auth.example.com/application/o/infinidysk/`.

### Authelia

1. Add infinidysk under `identity_providers.oidc.clients` with a hashed client secret.
2. Add the redirect URI to `redirect_uris`.
3. Allow the `openid`, `profile` and `email` scopes.
4. Set an `authorization_policy` that only admins pass.
5. Use Authelia's own address as the Issuer URL, for example `https://auth.example.com`.

### Keycloak

1. Create an OpenID Connect client with **Client authentication** on and **Standard flow** on.
2. Add the redirect URI to **Valid redirect URIs**.
3. Copy the client secret from the client's **Credentials** tab.
4. Limit access, for example with a realm or client role and an authentication flow that requires it.
5. Use the realm issuer as the Issuer URL, for example `https://keycloak.example.com/realms/media`.

## Troubleshooting

When SSO fails, the sign-in card shows a short message and the log has a warning, `SSO sign-in failed` or `SSO sign-in could not start`, with a `reason` field. See [Logs and traces](/v2/operate/logs-traces/).

- **Redirect URI mismatch at the provider.** Compare the Redirect URI field in Settings (its placeholder shows the address used when it is empty) with the one registered at the provider. Set the Public URL or the Redirect URI when infinidysk is behind a proxy.
- **Issuer mismatch.** The Issuer URL must match the `issuer` in the provider's `/.well-known/openid-configuration`, including any trailing slash.
- **Client authentication failed.** Check the client secret. infinidysk sends the secret in the request body when the provider lists `client_secret_post`, and as HTTP Basic otherwise.
- **Login expired.** A sign-in must finish within 10 minutes. Start again from the sign-in page.
- **The wrong username shows.** Set **Username claim** to a string claim your provider puts in the ID token.

After the provider rotates its signing keys, infinidysk picks up the new keys within about a minute.

## Upgrading from 1.x

The upgrade carries SSO over from the 1.x `OIDC_*` variables. 2.x no longer reads those variables; see [Before you upgrade](/v2/upgrade/#single-sign-on).
