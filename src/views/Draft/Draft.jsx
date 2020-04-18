import React, { useMemo } from 'react';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { Editor, createEditor } from 'slate';
import ReactDOM from 'react-dom';
import isHotkey from 'is-hotkey';
import { withHistory } from 'slate-history';
import moment from 'moment';
import { StatefulTooltip } from 'baseui/tooltip';
import { Button, SHAPE, KIND, SIZE } from 'baseui/button';
import { StatefulMenu } from 'baseui/menu';
import Navigation from '../../components/Navigation';
import { Redirect } from 'react-router-dom';
import { Card, StyledBody } from 'baseui/card';
import { useStyletron } from 'baseui';
import { Input, StyledInput } from 'baseui/input';
import { Tag, VARIANT as TAG_VARIANT } from 'baseui/tag';
import { ContextMenu, hideMenu, ContextMenuTrigger } from 'react-contextmenu';
// Import the Slate editor factory.

import { connect } from 'react-redux';
import { ButtonEditor, Icon, Toolbar } from '../../components/submitHelper';
import { getCurrentUser, loadUser } from '../../store/actions/auth/auth-actions';
import {
  submitDraft,
  getDraft,
  saveDraft,
  publishPost,
  handleSeenSubmit
} from '../../store/actions/user/user-actions';

const InputReplacement = ({ tags, removeTag, ...restProps }) => {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        flex: '1 1 0%',
        flexWrap: 'wrap',
        display: 'flex',
        alignItems: 'center'
      })}
    >
      {tags.map((tag, index) => (
        <Tag variant={TAG_VARIANT.solid} onActionClick={() => removeTag(tag)} key={index}>
          {tag}
        </Tag>
      ))}
      <StyledInput {...restProps} />
    </div>
  );
};

// check to see if valid user or not
// if valid, show
// if invalid, redirect to error page

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

function Draft(props) {
  const {
    user,
    submitDraftSuccess,
    userErrorMessage,
    submitPostSuccess,
    submittedDraft,
    submittedPost,
    getDraftSuccess,
    getDraftLoading,
    getDraftFailure,
    submitDraftDispatch,
    handleSeenSubmitDispatch,
    getCurrentUserDispatch,
    getDraftDispatch,
    saveDraftDispatch,
    submitDraftLoading,
    saveDraftLoading,
    publishPostDispatch,
    saveDraftSuccess
  } = props;

  const id = props.match.params.id.toLowerCase();

  const [title, setTitle] = React.useState('');
  const [value, setValue] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [slateValue, setSlateValue] = React.useState(initialValue);
  const addTag = tag => {
    setTags([...tags, tag]);
  };
  const removeTag = tag => {
    setTags(tags.filter(t => t !== tag));
  };

  const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
    'mod+s': 'save',
    'mod+l': 'latex',
    'mod+k': 'link',
    'mod+d': 'annotate',
    'mod+shift+i': 'insert_image'
  };

  let disabledSave =
    submitDraftLoading || saveDraftLoading || !title || !slateValue || tags.length === 0;

  const editor = useMemo(() => withRichText(withHistory(withReact(createEditor()))), []);

  React.useEffect(() => {
    getDraftDispatch({ env: process.env.REACT_APP_NODE_ENV, draftId: id });
  }, [id, getDraftDispatch]);

  React.useEffect(() => {
    console.log('new update');
    async function updateUser() {
      await getCurrentUserDispatch({ env: process.env.REACT_APP_NODE_ENV });
    }

    updateUser();
  }, [props.submitDraftSuccess, props.markSeenSubmitTutorial, getCurrentUserDispatch]);

  React.useEffect(() => {
    console.log('updating state');
    if (!isEmpty(submittedDraft) && getDraftSuccess) {
      setTitle(submittedDraft.title);
      setTags(submittedDraft.categories);
      setSlateValue(JSON.parse(submittedDraft.text));
    }
  }, [getDraftSuccess, submittedDraft]);

  const handleKeyDown = event => {
    switch (event.keyCode) {
      // Enter
      case 13: {
        if (!value) return;
        addTag(value);
        setValue('');
        return;
      }
      // Backspace
      case 8: {
        if (value || !tags.length) return;
        removeTag(tags[tags.length - 1]);
        return;
      }
      default:
        break;
    }
  };

  const renderElement = React.useCallback(props => <Element {...props} />, []);
  const renderLeaf = React.useCallback(props => <Leaf {...props} />, []);

  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  return (
    <div style={{ width: '100%' }}>
      <Navigation searchBarPosition="center" />
      <div style={{ width: '100%', background: '#fff', height: 'calc(100vh - 70px)' }}>
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 50 }}>
          {!isEmpty(user) && !user.seenSubmitTutorial && !getDraftFailure && (
            <Card
              overrides={{
                Root: {
                  style: {
                    width: '60%',
                    margin: '0 auto',
                    marginBottom: '30px'
                  }
                }
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Tag
                    overrides={{ Root: { style: { marginLeft: 0 } } }}
                    closeable={false}
                    variant={'variant'}
                    kind="accent"
                  >
                    Tutorial
                  </Tag>
                </div>
                <div
                  onClick={() =>
                    handleSeenSubmitDispatch({ env: process.env.REACT_APP_NODE_ENV, type: 'submit' })
                  }
                  style={{ cursor: 'pointer', color: 'black' }}
                >
                  X
                </div>
              </div>
              <div style={{ marginTop: 15 }}>
                Welcome to Giving Tree's document editor! You can edit documents, upload documents
                and annotate research. The goal is to help foster greater discussion in spreading
                truth and knowledge.
              </div>
            </Card>
          )}
          {submitPostSuccess && (
            <Card
              overrides={{
                Root: {
                  style: {
                    width: '60%',
                    margin: '0 auto',
                    marginBottom: '30px',
                    color: 'green'
                  }
                }
              }}
            >
              Your post is now live! Check it out{' '}
              <a style={{ textDecoration: 'none' }} href={`/post/${submittedPost._id}`}>
                here
              </a>
              .
            </Card>
          )}
          {(!getDraftFailure && !isEmpty(submittedDraft)) || getDraftLoading ? (
            <Card
              overrides={{
                Root: {
                  style: {
                    width: '60%',
                    margin: '0 auto'
                  }
                }
              }}
            >
              {!submitPostSuccess && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginTop: 0, marginBottom: 0 }}>Draft</h2>
                  </div>
                  <div style={{ display: 'flex', alignContent: 'center' }}>
                    <div
                      style={{
                        marginRight: 15,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {(saveDraftSuccess || submitDraftSuccess) &&
                        !isEmpty(submittedDraft) &&
                        `saved ${moment(submittedDraft.updatedAt).fromNow()}`}
                    </div>
                    {disabledSave ? (
                      <StatefulTooltip
                        content={'Please enter title, content and tags before saving'}
                      >
                        <Button
                          style={{
                            marginRight: !isEmpty(submittedDraft) ? 23 : 0,
                            fontSize: '12px',
                            backgroundColor: disabledSave ? 'grey' : '#03a87c',
                            color: 'white'
                          }}
                          size={SIZE.compact}
                          kind={KIND.secondary}
                          shape={SHAPE.pill}
                          disabled={disabledSave}
                        >
                          {submitDraftLoading || saveDraftLoading
                            ? 'Saving...'
                            : saveDraftSuccess || submitDraftSuccess
                            ? 'Saved'
                            : 'Save'}
                        </Button>
                      </StatefulTooltip>
                    ) : (
                      <Button
                        style={{
                          marginRight: !isEmpty(submittedDraft) ? 23 : 0,
                          fontSize: '12px',
                          backgroundColor: '#03a87c',
                          color: 'white'
                        }}
                        size={SIZE.compact}
                        kind={KIND.secondary}
                        shape={SHAPE.pill}
                        disabled={disabledSave}
                        onClick={() => {
                          if (isEmpty(submittedDraft)) {
                            // create new draft and store on store
                            submitDraftDispatch({
                              env: process.env.REACT_APP_NODE_ENV,
                              title,
                              text: JSON.stringify(slateValue),
                              categories: tags.join(',')
                            });
                          } else {
                            // update existing draft and update on store
                            saveDraftDispatch({
                              env: process.env.REACT_APP_NODE_ENV,
                              postId: submittedDraft._id,
                              title,
                              text: JSON.stringify(slateValue),
                              categories: tags.join(',')
                            });
                          }
                        }}
                      >
                        {submitDraftLoading || saveDraftLoading
                          ? 'Saving...'
                          : saveDraftSuccess || submitDraftSuccess
                          ? 'Saved'
                          : 'Save'}
                      </Button>
                    )}
                    {/* only see publish button when a draft exists */}
                    {!isEmpty(submittedDraft) && (
                      <Button
                        style={{ fontSize: '12px' }}
                        onClick={() => {
                          // take existing draft and publish it (notify followers and make publically shareable)
                          publishPostDispatch({
                            env: process.env.REACT_APP_NODE_ENV,
                            postId: submittedDraft._id,
                            title,
                            text: JSON.stringify(slateValue),
                            categories: tags.join(',')
                          });
                        }}
                        size={SIZE.compact}
                        shape={SHAPE.pill}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <Input
                value={title}
                overrides={{ Root: { style: { marginTop: '20px' } } }}
                onChange={event => setTitle(event.currentTarget.value)}
                placeholder="Title"
              />
              <div style={{ marginTop: 20 }}>
                <ContextMenuTrigger id="giving-tree-editor">
                  <Slate
                    editor={editor}
                    value={slateValue}
                    onChange={value => {
                      setSlateValue(value);
                      const content = JSON.stringify(value);
                      console.log('content: ', content);
                    }}
                  >
                    <Toolbar>
                      <MarkButton format="bold" icon="format_bold" />
                      <MarkButton format="italic" icon="format_italic" />
                      <MarkButton format="underline" icon="format_underlined" />
                      <MarkButton format="code" icon="code" />
                      <BlockButton format="heading-one" icon="looks_one" />
                      <BlockButton format="heading-two" icon="looks_two" />
                      <BlockButton format="block-quote" icon="format_quote" />
                      <BlockButton format="numbered-list" icon="format_list_numbered" />
                      <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                    </Toolbar>
                    <Editable
                      onClick={event => {
                        console.log('click: ', event);
                      }}
                      renderLeaf={renderLeaf}
                      renderElement={renderElement}
                      spellCheck
                      autoFocus
                      onKeyDown={event => {
                        console.log('event: ', event);
                        for (const hotkey in HOTKEYS) {
                          if (isHotkey(hotkey, event)) {
                            console.log('here: ', HOTKEYS[hotkey]);
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];

                            console.log('mark: ', mark);
                            switch (mark) {
                              case 'bold':
                              case 'italic':
                              case 'underline':
                              case 'code':
                                editor.exec({
                                  type: 'format_text',
                                  properties: { [mark]: true }
                                });
                                break;
                              case 'save':
                                if (disabledSave) {
                                  console.log('cannot save yet');
                                } else {
                                  if (isEmpty(submittedDraft)) {
                                    // create new draft and store on store
                                    submitDraftDispatch({
                                      env: process.env.REACT_APP_NODE_ENV,
                                      title,
                                      text: JSON.stringify(slateValue),
                                      categories: tags.join(',')
                                    });
                                  } else {
                                    // update existing draft and update on store
                                    saveDraftDispatch({
                                      env: process.env.REACT_APP_NODE_ENV,
                                      postId: submittedDraft._id,
                                      title,
                                      text: JSON.stringify(slateValue),
                                      categories: tags.join(',')
                                    });
                                  }
                                }
                                break;
                              case 'cut':
                                console.log(`cut`);
                                break;
                              case 'paste':
                                console.log(`paste`);
                                break;
                              case 'copy':
                                console.log(`copy`);
                                break;
                              case 'latex':
                                console.log(`latex`);
                                break;
                              case 'link':
                                console.log(`link`);
                                break;
                              case 'annotate':
                                console.log(`annotate`);
                                break;
                              case 'insert_image':
                                console.log(`insert_image`);
                                break;
                              default:
                                break;
                            }
                          }
                        }
                      }}
                    />
                  </Slate>
                </ContextMenuTrigger>
                <ContextMenu id="giving-tree-editor">
                  <StatefulMenu
                    overrides={{
                      List: { style: { outline: 'none', width: '347px', borderRadius: '10px' } }
                    }}
                    onItemSelect={e => {
                      switch (e.item.command) {
                        case 'cut':
                          console.log('cut');
                          break;
                        case 'copy':
                          console.log('copy');
                          break;
                        case 'paste':
                          console.log('paste');
                          break;
                        case 'annotate':
                          console.log('annotate');
                          break;
                        case 'link':
                          console.log('link');
                          break;
                        case 'latex':
                          console.log('latex');
                          break;
                        default:
                          break;
                      }
                      hideMenu();
                    }}
                    items={[
                      {
                        command: 'cut',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/cut.svg"
                                alt="cut"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Cut</div>
                            </div>
                            <div>⌘&nbsp;X</div>
                          </div>
                        )
                      },
                      {
                        command: 'copy',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/copy.svg"
                                alt="copy"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Copy</div>
                            </div>
                            <div>⌘&nbsp;C</div>
                          </div>
                        )
                      },
                      {
                        command: 'paste',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/paste.svg"
                                alt="paste"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Paste</div>
                            </div>
                            <div>⌘&nbsp;V</div>
                          </div>
                        )
                      },
                      {
                        command: 'annotate',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/annotate.svg"
                                alt="annotate"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Annotate</div>
                            </div>
                            <div>⌘&nbsp;D</div>
                          </div>
                        )
                      },
                      {
                        command: 'image',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/photo.svg"
                                alt="upload"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Import Image</div>
                            </div>
                            <div>⌘+Shift+I</div>
                          </div>
                        )
                      },
                      {
                        command: 'link',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/link.svg"
                                alt="link"
                                style={{ height: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Link</div>
                            </div>
                            <div>⌘&nbsp;K</div>
                          </div>
                        )
                      },
                      {
                        command: 'latex',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://d1ppmvgsdgdlyy.cloudfront.net/tex.svg"
                                alt="latex"
                                style={{ width: '12px', marginRight: 7, alignItems: 'center' }}
                              />
                              <div>Add LaTeX</div>
                            </div>
                            <div>⌘&nbsp;L</div>
                          </div>
                        )
                      }
                    ]}
                  />
                </ContextMenu>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  marginTop: 20
                }}
              >
                <div style={{ width: '80%' }}>
                  <Input
                    value={value}
                    disabled={submitPostSuccess}
                    placeholder={'Add categories...'}
                    onChange={e => setValue(e.currentTarget.value)}
                    overrides={{
                      Input: {
                        style: { width: 'auto', flexGrow: 1 },
                        component: InputReplacement,
                        props: {
                          tags: tags,
                          removeTag: removeTag,
                          onKeyDown: handleKeyDown
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
          ) : userErrorMessage === `Draft is already published` ? (
            <Redirect to={`/post/${id}`} />
          ) : (
            <StyledBody style={{ textAlign: 'center', margin: '0 auto', marginTop: 10 }}>
              Draft {id} doesn't exist
            </StyledBody>
          )}
        </div>
      </div>
    </div>
  );
}

const withRichText = editor => {
  const { exec } = editor;

  editor.exec = command => {
    if (command.type === 'format_block') {
      const { format } = command;
      const isActive = isBlockActive(editor, format);
      const isList = LIST_TYPES.includes(format);

      for (const f of LIST_TYPES) {
        Editor.unwrapNodes(editor, { match: n => n.type === f, split: true });
      }

      Editor.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format
      });

      if (!isActive && isList) {
        Editor.wrapNodes(editor, { type: format, children: [] });
      }
    } else {
      exec(command);
    }
  };

  return editor;
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
    mode: 'all'
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          style={{ borderLeft: '2px solid rgba(0,0,0,.54)', paddingLeft: 10, marginLeft: 20 }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.annotated) {
    children = (
      <div style={{ backgroundColor: 'rgb(255, 225, 104)', opacity: '30%' }}>{children}</div>
    );
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ButtonEditor
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: 'format_block', format });
      }}
    >
      <Icon>{icon}</Icon>
    </ButtonEditor>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ButtonEditor
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: 'format_text', properties: { [format]: true } });
      }}
    >
      <Icon>{icon}</Icon>
    </ButtonEditor>
  );
};

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Loading' }]
  }
];

const mapDispatchToProps = dispatch => ({
  getCurrentUserDispatch: payload => dispatch(getCurrentUser(payload)),
  loadUserDispatch: payload => dispatch(loadUser(payload)),
  submitDraftDispatch: payload => dispatch(submitDraft(payload)),
  getDraftDispatch: payload => dispatch(getDraft(payload)),
  saveDraftDispatch: payload => dispatch(saveDraft(payload)),
  publishPostDispatch: payload => dispatch(publishPost(payload)),
  handleSeenSubmitDispatch: payload => dispatch(handleSeenSubmit(payload))
});

const mapStateToProps = state => ({
  user: state.auth.user,
  foundUser: state.auth.foundUser,
  errorMessage: state.auth.errorMessage,
  userErrorMessage: state.user.errorMessage,
  submitDraftSuccess: state.user.submitDraftSuccess,
  submitPostSuccess: state.user.submitPostSuccess,
  submittedDraft: state.user.submittedDraft,
  submittedPost: state.user.submittedPost,
  getDraftSuccess: state.user.getDraftSuccess,
  getDraftLoading: state.user.getDraftLoading,
  getDraftFailure: state.user.getDraftFailure,
  submitDraftLoading: state.user.submitDraftLoading,
  saveDraftLoading: state.user.saveDraftLoading,
  saveDraftSuccess: state.user.saveDraftSuccess,
  saveDraftFailure: state.user.saveDraftFailure,

  markSeenSubmitTutorial: state.user.markSeenSubmitTutorial
});

Draft.defaultProps = {};

Draft.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
