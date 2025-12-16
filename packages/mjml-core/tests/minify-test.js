const assert = require('chai').assert
const { default: mjml2html, registerComponent, BodyComponent, HeadComponent } = require('../lib/index')

class MockBody extends BodyComponent {
  static componentName = 'mj-body'
  render() {
    return `<body>${this.renderChildren()}</body>`
  }
}

class MockSection extends BodyComponent {
  static componentName = 'mj-section'
  render() {
    return `<div class="section">${this.renderChildren()}</div>`
  }
}

class MockColumn extends BodyComponent {
  static componentName = 'mj-column'
  render() {
    return `<div class="column">${this.renderChildren()}</div>`
  }
}

class MockText extends BodyComponent {
  static componentName = 'mj-text'
  render() {
    return `<div class="text">${this.getContent()}</div>`
  }
}

class MockHead extends HeadComponent {
  static componentName = 'mj-head'
  handler() {
    this.handlerChildren()
  }
}

class MockStyle extends HeadComponent {
  static componentName = 'mj-style'
  handler() {
    const { add } = this.context
    add('style', this.getContent())
  }
}

registerComponent(MockBody)
registerComponent(MockSection)
registerComponent(MockColumn)
registerComponent(MockText)
registerComponent(MockHead)
registerComponent(MockStyle)

describe('mjml2html minify', () => {
  it('should minify without errors', (done) => {
    const mjml = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>
                <h1>Hello World</h1>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const result = mjml2html(mjml, { minify: true, verbose: true })
    assert.exists(result.html)
    assert(result.html.length > 0)
    console.log('Minified HTML length:', result.html.length)
    done()
  })

  it('should purge CSS when enabled', (done) => {
    const mjml = `
      <mjml>
        <mj-head>
          <mj-style>
            .unused { color: red; }
            .used { color: blue; }
          </mj-style>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text class="used">Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const result = mjml2html(mjml, { purgeCSS: true, minify: true, verbose: true })
    assert.exists(result.html)
    assert(result.html.length > 0)
    assert.notInclude(result.html, 'unused')
    console.log('CSS purged HTML length:', result.html.length)
    done()
  })
})
