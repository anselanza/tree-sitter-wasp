import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.wasp.TreeSitterWasp;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterWaspTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterWasp.language()));
    }
}
