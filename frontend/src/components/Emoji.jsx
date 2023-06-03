import React, {useState} from 'react';
import Picker from 'emoji-picker-react';

/**
 * Emoji picker example
 *
 * @return {object} JSX
 */
function Emoji() {
  const [emoji, setEmoji] = useState({emoji: 'Select an emoji!'});

  const onEmojiClick = (event, emojiObject) => {
    setEmoji(emojiObject);
  };

  return (
    <div>
      <Picker onEmojiClick={onEmojiClick} />
      <h2>{emoji.emoji}</h2>
    </div>
  );
};

export default Emoji;
