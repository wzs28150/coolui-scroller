import * as vscode from 'vscode'

const SECTION = 'cooluiScroller'

export const config = {
  get enabled(): boolean {
    return vscode.workspace.getConfiguration(SECTION).get<boolean>('enable', true)
  },
  get diagnostics(): boolean {
    return vscode.workspace.getConfiguration(SECTION).get<boolean>('enableDiagnostics', true)
  },
  get packageName(): string {
    return vscode.workspace.getConfiguration(SECTION).get<string>('packageName', 'coolui-scroller')
  },
  get uniappPackageName(): string {
    return vscode.workspace
      .getConfiguration(SECTION)
      .get<string>('uniappPackageName', 'coolui-scroller-uni')
  },
  get docsBaseUrl(): string {
    return vscode.workspace
      .getConfiguration(SECTION)
      .get<string>('docsBaseUrl', 'https://wzs28150.github.io/coolui-scroller/v4/native/components')!
      .replace(/\/$/, '')
  },
  get uniappDocsBaseUrl(): string {
    return vscode.workspace
      .getConfiguration(SECTION)
      .get<string>(
        'uniappDocsBaseUrl',
        'https://wzs28150.github.io/coolui-scroller/v4/uniapp/components'
      )!
      .replace(/\/$/, '')
  },
}

export const TRIGGER_TAGS = ['<', ' ', '"', "'", ':', '-', '/', '@']
